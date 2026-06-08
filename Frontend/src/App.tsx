import { RPC_URL } from "./lib/constant";
import { PROGRAM_ID } from "./lib/constant";
import WalletConnect from "./components/Walletconnect";
import WalletInfo from "./components/Walletconnect";




const App = () =>{
  return(
    <div >
     <WalletConnect />
     <WalletInfo/>
     <p>RPC URL : {RPC_URL}</p>
     <p>Program Id : {PROGRAM_ID}</p>
    </div>
  )
}
export default App;
