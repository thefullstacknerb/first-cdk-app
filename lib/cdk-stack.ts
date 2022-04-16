import { SecretValue, Stack, StackProps, Stage } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { CfnBackupPlan } from 'aws-cdk-lib/aws-backup';
import { ComputeType, LinuxBuildImage } from 'aws-cdk-lib/aws-codebuild';
import { AppStage } from './app-stage';

export class CdkStack extends Stack {
  private repoOwner = 'khuongdo';
  private repoName = 'thefullstacknerb_first-cdk-app';

  constructor(s: Construct, id: string, props?: StackProps) {
    super(s, id, props);

    const source = pipelines.CodePipelineSource.gitHub(
      `${this.repoOwner}/${this.repoName}`,
      'main',
      {
        // the secret the stores the github token created before
        authentication: SecretValue.secretsManager('github-secret'),
      }
    );

    // create CDK pipeline that will automatically reflect changes on its 
    // own pipeline and its resources, 
    const cdkPipeline = new pipelines.CodePipeline(this, 'CdkPipeline', {
      selfMutation: true,
      codeBuildDefaults: {
        buildEnvironment: {
          buildImage: LinuxBuildImage.STANDARD_5_0,
          computeType: ComputeType.SMALL,
        },
      },
      synth: new pipelines.ShellStep('Synth', {
        input: source,
        commands: ['npm ci', 'npm run build', 'npx cdk synth'],
      }),
    });

    // create infrastructure for web application
    cdkPipeline.addStage(new AppStage(this, 'AppStage'));
  }
}
