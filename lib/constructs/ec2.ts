import { Construct } from "constructs";
import { SecurityGroupConstruct } from "./security-group";
import { VpcConstruct } from "./vpc";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { UserData } from "aws-cdk-lib/aws-ec2";

interface IEc2InstanceProps {
  vpc: VpcConstruct;
  sg: SecurityGroupConstruct;
}

export class Ec2InstanceConstruct extends Construct {
  readonly instance: ec2.Instance;

  constructor(s: Construct, id: string, props: IEc2InstanceProps) {
    super(s, id);

    const {
      vpc: { vpc, publicSubnets },
      sg
    } = props;

    const amznLinux = new ec2.AmazonLinuxImage({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      edition: ec2.AmazonLinuxEdition.STANDARD,
      virtualization: ec2.AmazonLinuxVirt.HVM,
      storage: ec2.AmazonLinuxStorage.GENERAL_PURPOSE,
    });

    const userData = UserData.forLinux();

    // commands to install mysql
    userData.addCommands(
      "sudo yum update -y",
      "sudo yum install -y mariadb-server",
      "sudo systemctl enable mariadb",
      "sudo systemctl start mariadb"
    )
    const ec2Instance = new ec2.Instance(this, "Webserver", {
      instanceName: "Webserver",
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.SMALL
      ),
      machineImage: amznLinux,
      blockDevices: [
        {
          deviceName: '/dev/sda1',
          volume: ec2.BlockDeviceVolume.ebs(8)
        }
      ],
      vpc: vpc,
      vpcSubnets: {
        subnets: publicSubnets,
      },
      securityGroup: sg.webServerSG,
      keyName: "cdk-tutorial", // the key pair that we just have created
      userData: userData
    });



    this.instance = ec2Instance;
  }
}
