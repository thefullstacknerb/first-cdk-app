import { Construct } from "constructs";
import { SecurityGroupConstruct } from "./security-group";
import { VpcConstruct } from "./vpc";
import * as ec2 from "aws-cdk-lib/aws-ec2";

interface IEc2InstanceProps {
  vpc: VpcConstruct;
  sg: SecurityGroupConstruct;
}

export class Ec2InstanceConstruct extends Construct {
  readonly instance: ec2.Instance;

  constructor(s: Construct, id: string, props: IEc2InstanceProps) {
    super(s, id);

    const {
      vpc: { vpc, publicSubnet },
    } = props;

    const ec2Instance = new ec2.Instance(this, "Webserver", {
      instanceName: "Webserver",
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.SMALL
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux(),
      blockDevices: [
        {
          deviceName: 'dev/sda1',
          volume: ec2.BlockDeviceVolume.ebs(8)
        }
      ],
      vpc: vpc,
      vpcSubnets: {
        subnets: [publicSubnet],
      },
    });

    this.instance = ec2Instance;
  }
}
