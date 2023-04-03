import { h, Fragment, RenderableProps, FunctionComponent } from 'preact';
import { useComputed, useSignal, signal } from '@preact/signals';
import Editor from './Editor';
import 'add-css:./styles.module.css';
import * as styles from './styles.module.css';
import Graph from './Graph';
import useFullPointGeneration from './useFullPointGeneration';
import { CodeHighlight, CodeType } from './types';
import Optim from './Optim';
import useOptimizedPoints from './useOptimizedPoints';
import useLinearSyntax from './useLinearSyntax';
import AnimatedDemos from './AnimatedDemos';
import useFriendlyLinearCode from './useFriendlyLinearCode';
import useURLState from './useURLState';
import DemoLinks from './DemoLinks';
import CopyButton from './CopyButton';
import Input from './Input';

interface Props {}

const App: FunctionComponent<Props> = ({}: RenderableProps<Props>) => {
  const { codeType, code, simplify, round, update } = useURLState();

  const [fullPoints, codeError] = useFullPointGeneration(code, codeType);
  const optimizedPoints = useOptimizedPoints(fullPoints, simplify, round);
  const outputReady = useComputed(
    () => !!fullPoints.value && !!optimizedPoints.value,
  );
  // Just pass through the original SVG for the graph, if the input is SVG
  const graphFullPoints = useComputed(() =>
    codeType.value === CodeType.JS ? fullPoints.value : code.value,
  );
  const linear = useLinearSyntax(optimizedPoints, round);
  const friendlyExample = useFriendlyLinearCode(linear);

  // Create slightly optimized version for the demos
  const slightlyOptimizedPoints = useOptimizedPoints(
    fullPoints,
    useSignal(0.00001),
    useSignal(5),
  );
  const slightlyOptimizedLinear = useLinearSyntax(
    slightlyOptimizedPoints,
    useSignal(5),
  );

  return (
    <>
      <div class={styles.inputColumn}>
        <Input
          code={code}
          codeType={codeType}
          error={codeError}
          onChange={(code, codeType) => update({ code, codeType })}
        />
      </div>
      {/*

      <DemoLinks onStateUpdate={(newState) => update(newSta
      {outputReady.value && (
        <Graph fullPoints={graphFullPoints} optimizedPoints={optimizedPoints} />
      )}
      <Optim
        onInput={(newSimplify, newRound) =>
          update({
            simplify: newSimplify,
            round: newRound,
          })
        }
        round={round}
        simplify={simplify}
      />
      <Editor
        code={friendlyExample}
        language={signal(CodeHighlight.CSS)}
        readOnly
      />
      <CopyButton value={friendlyExample} />
      {outputReady.value && (
        <AnimatedDemos
          linear={linear}
          slightlyOptimizedLinear={slightlyOptimizedLinear}
        />
      )}
      */}
    </>
  );
};

export { App as default };
