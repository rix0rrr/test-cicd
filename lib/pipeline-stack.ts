import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { ScenarioStage } from './scenario';

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      // The pipeline name
      pipelineName: 'TestingPipeline',

      crossAccountKeys: true,

      // Where the source can be found
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('rix0rrr/test-cicd', 'master'),
        commands: [
          'yarn install --frozen-lockfile',
          'yarn build',
          'npx cdk synth',
        ]
      }),
    });

    pipeline.addStage(new ScenarioStage(this, 'TheStage'));
  }
}

