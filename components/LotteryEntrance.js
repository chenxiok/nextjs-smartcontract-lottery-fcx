import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled, enableWeb3, account } = useMoralis()
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()

    const [raffleAddress, setRaffleAddress] = useState(null)

    useEffect(() => {
        if (!isWeb3Enabled) {
            enableWeb3()
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        if (chainIdHex) {
            const chainId = parseInt(chainIdHex, 16).toString()
            console.log(chainId, "chainId") // 添加调试信息
            console.log(contractAddresses, "contractAddresses")
            const address = chainId in contractAddresses ? contractAddresses[chainId][0] : null
            console.log(address, "address")
            setRaffleAddress(address)
            // console.log(address, "raffleAddress") // 添加调试信息
        }
    }, [chainIdHex])

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    useEffect(() => {
        if (isWeb3Enabled && raffleAddress) {
            async function updateUI() {
                const entranceFeeFromCall = (await getEntranceFee()).toString()
                const numPlayersFromCall = (await getNumberOfPlayers()).toString()
                const recentWinnerFromCall = await getRecentWinner()
                setEntranceFee(entranceFeeFromCall)
                setNumPlayers(numPlayersFromCall)
                setRecentWinner(recentWinnerFromCall)
            }
            updateUI()
        }
    }, [isWeb3Enabled, raffleAddress])

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }
    const handleNewNotification = function (tx) {
        dispatch({
            type: "success",
            message: "Transaction successful",
            title: "Transaction successful",
            position: "topR",
            icon: "bell",
        })
    }

    const handleNotification = () => {
        dispatch({
            type: "success",
            message: "Transaction successful",
            title: "Transaction successful",
            position: "topR",
        })
    }
    const handleEnterRaffle = async () => {
        if (!isWeb3Enabled) {
            await enableWeb3()
        }
        if (!raffleAddress) {
            console.error("No raffle address detected")
            return
        }
        console.log("Entering raffle with fee:", entranceFee) // 添加调试信息
        await enterRaffle({
            onSuccess: handleSuccess,
            onError: (error) => console.error(error),
        })
    }

    return (
        <div className="p-5">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleEnterRaffle}
                disabled={isLoading || isFetching}
            >
                {isLoading || isFetching ? (
                    <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                ) : (
                    <div>Enter Raffle</div>
                )}
            </button>
            <div>
                <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
                <div>Number OfPlayers: {numPlayers}</div>
                <div>Recent Winner: {recentWinner}</div>
            </div>
        </div>
    )
}
