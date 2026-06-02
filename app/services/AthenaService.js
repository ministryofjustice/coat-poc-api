const {
  AthenaClient,
  StartQueryExecutionCommand,
  GetQueryExecutionCommand,
  paginateGetQueryResults
} = require('@aws-sdk/client-athena');

class AthenaService {
  constructor(database, environment, credentials) {
    this.client = new AthenaClient({
      region: 'eu-west-2',
      credentials
    });

    this.database = database;
    this.workgroup = 'primary';
    this.outputLocation =
      environment === 'production'
        ? 's3://coat-production-cur-v2-hourly/athena-results'
        : 's3://coat-development-athena-output-clickops/Unsaved';
  }

  async startQuery(query) {
    const response = await this.client.send(
      new StartQueryExecutionCommand({
        QueryString: query,
        QueryExecutionContext: { Database: this.database },
        ResultConfiguration: { OutputLocation: this.outputLocation },
        WorkGroup: this.workgroup
      })
    );

    return response.QueryExecutionId || '';
  }

  async waitForQuery(queryExecutionId) {
    while (true) {
      const response = await this.client.send(
        new GetQueryExecutionCommand({
          QueryExecutionId: queryExecutionId
        })
      );

      const state = response?.QueryExecution?.Status?.State || '';

      if (state === 'SUCCEEDED') {
        return;
      }

      if (state === 'FAILED' || state === 'CANCELLED') {
        const reason =
          response?.QueryExecution?.Status?.StateChangeReason || '';
        throw new Error(`Athena query ${state}: ${reason}`);
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  async getResults(queryExecutionId) {
    const paginator = paginateGetQueryResults(
      { client: this.client, pageSize: 1000 },
      { QueryExecutionId: queryExecutionId }
    );

    let columns = [];
    const rows = [];

    for await (const page of paginator) {
      if (columns.length === 0) {
        columns =
          page?.ResultSet?.ResultSetMetadata?.ColumnInfo?.map(
            column => column.Name || ''
          ) || [];
      }

      for (const row of page?.ResultSet?.Rows || []) {
        const values = (row.Data || []).map(field => field.VarCharValue || '');
        const keyValues = Object.fromEntries(
          columns.map((col, index) => [col, values[index]])
        );

        rows.push(keyValues);
      }
    }

    return rows.slice(1);
  }

  async runQuery(query) {
    console.log(`Running Athena query: ${query}`);

    const queryExecutionId = await this.startQuery(query);
    await this.waitForQuery(queryExecutionId);
    const athenaResponse = await this.getResults(queryExecutionId);

    console.log('Query result:');
    for (const row of athenaResponse) {
      console.log(row);
    }

    return athenaResponse;
  }
}

module.exports = AthenaService;