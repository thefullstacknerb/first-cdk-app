import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Ec2InstanceConstruct } from "./constructs/ec2";
import { RdsConstruct } from "./constructs/rds";
import { RdsSecretConstruct } from "./constructs/secret";
import { NetworkStack } from "./network-stack";

interface AppStackProps extends StackProps {
  // this is how we can refer resources that created by
  // another stacks
  network: NetworkStack;
}
export class AppStack extends Stack {
  constructor(s: Construct, id: string, props: AppStackProps) {
    super(s, id, props);

    const {
      network: { vpc, securityGroup },
    } = props;

    const rds = new RdsConstruct(this, "RdsConstruct", {
      vpc,
      sg: securityGroup,
    });

    const webServer = new Ec2InstanceConstruct(this, "WebServerConstruct", {
      vpc,
      sg: securityGroup,
    });

    
    /** You can also attach a separate secret to RDS instead
     * regarding to the default one
     */
    // const secret = new RdsSecretConstruct(this, "RdsSecretConstruct", {
    //   rds,
    // });
  }
}
