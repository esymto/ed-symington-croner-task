import logo from './assets/logo.svg';
import './App.css';

function App() {

  return (
    <>
      <header>
        <div className='container px-8 py-4'>
          <img src={logo} width="145" height="38" alt="BrightHR" />
        </div>
      </header>
      <main>
        <div className='container px-8 mt-4'>
          <h1>Absences</h1>
        </div>
      </main>
    </>
  )
}

export default App
