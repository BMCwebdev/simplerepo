import { Keyboard } from './components/Keyboard';
import { Icon } from './components/Icon';

function App() {
  return (
    <>
      <Icon name="house" />
      <Keyboard outline>
        <div>Hello</div>
      </Keyboard>
    </>
  );
}

export default App;
