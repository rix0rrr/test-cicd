import * as cdk from '@aws-cdk/core';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { CdkPipeline, SimpleSynthAction } from '@aws-cdk/pipelines';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { MyStage } from './my-stage';
import { TrivialStage } from './trivial-stack';

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    const pipeline = new CdkPipeline(this, 'Pipeline', {
      // The pipeline name
      pipelineName: 'TestingPipeline',
      cloudAssemblyArtifact,

      // Where the source can be found
      sourceAction: new codepipeline_actions.GitHubSourceAction({
        owner: 'rix0rrr',
        repo: 'test-cicd',

        // This is actually less interesting detail we're working to get rid of
        actionName: 'GitHub',
        output: sourceArtifact,
        oauthToken: cdk.SecretValue.secretsManager('github-token'),
      }),

       // How it will be built and synthesized
       synthAction: SimpleSynthAction.standardNpmSynth({
         // We need a build step to compile the TypeScript Lambda
         buildCommand: 'npm run build',

         sourceArtifact,
         cloudAssemblyArtifact,
       }),
    });

    //----------------------------------------------------------------------
    //   APPLICATION STAGES
    //

    pipeline.addApplicationStage(new TrivialStage(this, 'InEnvironment'));
  }
}
