import * as cdk from '@aws-cdk/core';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { CdkPipeline, CodePipeline, CodePipelineSource, ShellScriptAction, ShellStep, SimpleSynthAction } from '@aws-cdk/pipelines';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { TrivialStage } from './trivial-stack';

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      // The pipeline name
      pipelineName: 'TestingPipeline',

      crossAccountKeys: true,

      // Where the source can be found
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('rix0rrr/test-cicd', 'master'),
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth',
        ]
      }),
    });

    //----------------------------------------------------------------------
    //   APPLICATION STAGES
    //

    const stage = new TrivialStage(this, 'InEnvironment', {
      env: { region: 'eu-west-1', account: '355421412380' },
    });

    pipeline.addStage(new TrivialStage(this, 'CrossRegion', {
      env: { region: 'us-east-2', account: '355421412380' },
    }));

    pipeline.addStage(new TrivialStage(this, 'XAcct', {
      env: {
        region: 'eu-west-1',
        account: '561462023695',
      },
    }));

    pipeline.addStage(new TrivialStage(this, 'XAcctXRegion', {
      env: {
        account: '561462023695',
        region: 'us-east-2',
      },
    }));
  }
}
