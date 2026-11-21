import logo from './assets/logo.svg';
import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Absences from './components/Absenses';

const queryClient = new QueryClient();

function App() {

	return (
		<QueryClientProvider client={queryClient}>
			<header>
				<div className='container px-8 py-4'>
					<img src={logo} width="145" height="38" alt="BrightHR" />
				</div>
			</header>
			<main>
				<div className='container px-8 mt-4'>
					<Absences />
				</div>
			</main>
		</QueryClientProvider>
	)
}

export default App;
