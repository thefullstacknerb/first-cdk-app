import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { ENV } from '../../env';
const VPC_CIDR = '192.168.0.0/16';
const PRIVATE_SUBNET_CIDR = '192.168.1.0/24';
const PUBLIC_SUBNET_CIDR = '192.168.2.0/24';

export class VpcConstruct extends Construct {
  // Export vpc and subnets
  readonly vpc: ec2.Vpc;
  readonly publicSubnet: ec2.ISubnet;
  readonly privateSubnet: ec2.ISubnet;

  constructor(s: Construct, id: string) {
    super(s, id);

    const vpc = new ec2.Vpc(this, 'MyVpc', {
      cidr: VPC_CIDR,
      maxAzs: 1, // how many AZs VPC can expand
      // create 1 private isolated (without NAT Gateway) + 1 public subnet in each AZ
      subnetConfiguration: [
        {
          name: 'PrivateIsolatedSubnet',
          cidrMask: 24,
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
        {
          name: 'Public',
          cidrMask: 24,
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    const publicSubnet = vpc.selectSubnets({
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
    }).subnets[0];

    const privateSubnet = vpc.selectSubnets({
      subnetType: ec2.SubnetType.PUBLIC
    }).subnets[0]

    // Export resource to be imported to another stack
    this.vpc = vpc;
    this.publicSubnet = publicSubnet;
    this.privateSubnet = privateSubnet;
  }
}
