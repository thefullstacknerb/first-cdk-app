import { Construct } from "constructs";
import * as rds from "aws-cdk-lib/aws-rds";
import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { VpcConstruct } from "./vpc";
import { SecurityGroupConstruct } from "./security-group";
import { RemovalPolicy } from "aws-cdk-lib";

interface IRdsConstructProps {
  vpc: VpcConstruct;
  sg: SecurityGroupConstruct;
}
export class RdsConstruct extends Construct {
  readonly rdsInstance: rds.DatabaseInstance;
  constructor(s: Construct, id: string, props: IRdsConstructProps) {
    super(s, id);

    const {
      vpc: { vpc, privateSubnets },
      sg: { rdsSG },
    } = props;

    const rdsInstance = new rds.DatabaseInstance(this, "RdsInstance", {
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.NANO
      ),

      // Mysql8.0
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0_28
      }),
      vpc: vpc,
      vpcSubnets: {
        subnets: privateSubnets
      },
      allocatedStorage: 8, //8GB
      databaseName: "MyDatabase",
      securityGroups: [rdsSG],
      // It a good idea that choose RETAIN policy in production
      removalPolicy: RemovalPolicy.DESTROY,
      multiAz: false
    });

    this.rdsInstance = rdsInstance;
  }
}
