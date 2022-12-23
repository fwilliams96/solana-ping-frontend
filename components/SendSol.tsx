import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as Web3 from '@solana/web3.js'
import { FC, useState } from 'react'
import styles from '../styles/SendSol.module.css'

export const SendSol: FC = () => {
	const { connection } = useConnection();
	const { publicKey, sendTransaction } = useWallet();
	const [solAmountValue, setSolAmountValue] = useState(0);
	const [destinationAddressValue, setDestinationAddressValue] = useState('');
    const [txSig, setTxSig] = useState('');

	const link = () => {
        return txSig ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet` : ''
    }

	const onSolAmountChange = (event) => {
		const { value } = event.target;
		setSolAmountValue(value);
	};

	const onDestinationAddressChange = (event) => {
		const { value } = event.target;
		setDestinationAddressValue(value);
	};

	const sendSol = event => {
		event.preventDefault()
        console.log(`Send ${event.target.amount.value} SOL to ${event.target.recipient.value}`)
        console.log(`Send ${solAmountValue} SOL to ${destinationAddressValue}`)

		if (!connection || !publicKey) { 
			alert("Please connect your wallet first lol")
			return
		}

		const transaction = new Web3.Transaction()
        const recipientPubKey = new Web3.PublicKey(destinationAddressValue)

		const sendSolInstruction = Web3.SystemProgram.transfer(
			{
				fromPubkey: publicKey,
				toPubkey: recipientPubKey, 
				lamports: solAmountValue*Web3.LAMPORTS_PER_SOL,
			}
		)

		transaction.add(sendSolInstruction)
		sendTransaction(transaction, connection).then(sig => {
			console.log(`Explorer URL: https://explorer.solana.com/tx/${sig}?cluster=devnet`)
		})
	}

	return (
        <div>
            {
                publicKey ?
                    <form onSubmit={sendSol} className={styles.form}>
                        <label htmlFor="amount">Amount (in SOL) to send:</label>
                        <input id="amount" type="text" className={styles.formField} 
						placeholder="e.g. 0.1" onChange={onSolAmountChange} required />
                        <br />
                        <label htmlFor="recipient">Send SOL to:</label>
                        <input id="recipient" type="text" className={styles.formField} onChange={onDestinationAddressChange}
						placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA" required />
                        <button type="submit" className={styles.formButton}>Send</button>
                    </form> :
                    <span>Connect Your Wallet</span>
            }
            {
                txSig ?
                    <div>
                        <p>View your transaction on </p>
                        <a href={link()}>Solana Explorer</a>
                    </div> :
                    null
            }
        </div>
    )
}