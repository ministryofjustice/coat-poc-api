const { STSClient, AssumeRoleCommand } = require('@aws-sdk/client-sts');

class IAMService {
  constructor(region = 'eu-west-2') {
    this.client = new STSClient({ region });
  }

  async assumeRole(roleArn, sessionName = 'api-session') {
    const command = new AssumeRoleCommand({
      RoleArn: roleArn,
      RoleSessionName: sessionName
    });

    const response = await this.client.send(command);
    const credentials = response.Credentials;

    if (!credentials) {
      throw new Error('Failed to assume role: no credentials returned');
    }

    return {
      accessKeyId: credentials.AccessKeyId,
      secretAccessKey: credentials.SecretAccessKey,
      sessionToken: credentials.SessionToken,
      expiration: credentials.Expiration
    };
  }
}

module.exports = IAMService;