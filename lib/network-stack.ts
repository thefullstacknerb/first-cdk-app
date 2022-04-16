import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SecurityGroupConstruct } from './constructs/security-group';
import { VpcConstruct } from './constructs/vpc';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class NetworkStack extends Stack {
  readonly vpc: VpcConstruct;
  readonly securityGroup: SecurityGroupConstruct;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.vpc = new VpcConstruct(this, 'VpcConstruct');

    this.securityGroup = new SecurityGroupConstruct(this, "SecurityGroupConstruct", {
      vpc: this.vpc
    });
  }
}
