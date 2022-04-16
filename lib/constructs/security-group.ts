import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { VpcConstruct } from "./vpc";

interface ISecurityGroupProps {
  vpc: VpcConstruct;
}

export class SecurityGroupConstruct extends Construct {
  // Export SGs to use in other Stacks
  readonly webServerSG: ec2.SecurityGroup;
  readonly rdsSG: ec2.SecurityGroup;

  constructor(s: Construct, id: string, props: ISecurityGroupProps) {
    super(s, id);

    // import vpc that is created in VpcConstruct
    const {
      vpc: { vpc },
    } = props;

    const webserverSG = new ec2.SecurityGroup(this, "WebserverSecurityGroup", {
      securityGroupName: "WebserverSG",
      vpc: vpc,
      allowAllOutbound: true // default
    });

    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "Allow HTTP traffic from anywhere"
    );
    
    const rdsSG = new ec2.SecurityGroup(this, 'RdsSecurityGroup', {
      securityGroupName: 'RdsSG',
      vpc: vpc,
    })

    // allow traffic from Webserver security group 
    rdsSG.addIngressRule(
      ec2.Peer.securityGroupId(webserverSG.securityGroupId),
      ec2.Port.tcp(3306),
      "Allow traffic from Webserver"
    )

    // Export
    this.webServerSG = webserverSG;
    this.rdsSG = rdsSG;

  }
}
