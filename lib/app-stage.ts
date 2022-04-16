import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AppStack } from './app-stack';
import { NetworkStack } from './network-stack';

export class AppStage extends Stage {
  constructor(s: Construct, id: string, props?: StageProps) {
    super(s, id, props);

    const network = new NetworkStack(this, 'NetworkStack');
    const app = new AppStack(this, 'MyApp', { network });
  }
}
