
const CONTRACT_ADDRESS = "0xCa14f904E9b44Cb457B83746E67182287B7AAD6e";
const ABI_URL = "nwr5_genesis_abi.json";

let provider;
let signer;
let contract;

async function connectWallet() {
  if (!window.ethereum) return alert("MetaMask not detected!");
  await window.ethereum.request({ method: "eth_requestAccounts" });
  provider = new ethers.BrowserProvider(window.ethereum);
  signer = await provider.getSigner();
  document.getElementById("walletAddress").innerText = "Connected: " + (await signer.getAddress());

  const abi = await fetch(ABI_URL).then(res => res.json());
  contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
  document.getElementById("mint-section").style.display = "block";
}

async function mintBadge() {
  const uri = "ipfs://bafybeid7o47e3p7vcwcsi6oc6kg7t2uv4cang2ppfl5mys2qcmzzo3dyxi/genesis_badge_metadata.json";
  const tx = await contract.mintBadge(
    "Genesis Badge",
    2025,
    false,
    "NWR5 Farming",
    "See The Sun First on earth",
    uri
  );
  document.getElementById("mintStatus").innerText = "⏳ Minting...";
  await tx.wait();
  document.getElementById("mintStatus").innerText = "✅ Badge minted!";
}

document.getElementById("connectWallet").onclick = connectWallet;
document.getElementById("mintBadge").onclick = mintBadge;
