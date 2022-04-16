import { CfnOutput } from 'aws-cdk-lib';
import { DatabaseSecret } from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';
import { RdsConstruct } from './rds';

interface RdsSecretProps {
  rds: RdsConstruct;
}

export class RdsSecretConstruct extends Construct {
  constructor(s: Construct, id: string, props: RdsSecretProps) {
    super(s, id);

    const { rds } = props;

    /**
     * @see: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_rds.DatabaseSecret.html
     */
    const secret = new DatabaseSecret(this, 'DatabaseSecret', {
      username: 'thefullstacknerb',
      // or just leave it blank and CDK will automatically
      // define secret name for you
      secretName: 'TheFullStackNerb-RdsSecret',
    });

    const attachment = secret.attach(rds.rdsInstance);

    // rds.rdsInstance.addRotationMultiUser('admin', {
    //   secret: attachment,
    // });

    // Export resource
    new CfnOutput(this, 'RdsSecretOutput', {
      exportName: 'TheFullStackNerb-RdsSecret',
      value: secret.secretName,
    });
  }
}
