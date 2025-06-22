// dapp.js

let provider, signer, contract;
const contractAddress = "0xCa14f904E9b44Cb457B83746E67182287B7AAD6e";
const abiPath = "nwr5_genesis_abi.json";

const elements = {
  connectBtn: document.getElementById("connectBtn"),
  walletAddress: document.getElementById("walletAddress"),
  mintBtn: document.getElementById("mintBtn"),
  contributors: document.getElementById("contributors"),
  languageSelect: document.getElementById("language"),
  themeToggle: document.getElementById("themeToggle")
};

async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    const address = await signer.getAddress();
    elements.walletAddress.textContent = address.slice(0, 6) + "..." + address.slice(-4);
    await initContract();
  } else {
    alert("Please install MetaMask to use this feature.");
  }
}

elements.connectBtn.addEventListener("click", connectWallet);

elements.mintBtn.addEventListener("click", async () => {
  if (!contract || !signer) return;
  try {
    const tx = await contract.mintBadge(
      "Genesis Badge",
      2025,
      false,
      "NWR5 Farming",
      "See The Sun First on earth",
      "ipfs://bafybeid7o47e3p7vcwcsi6oc6kg7t2uv4cang2ppfl5mys2qcmzzo3dyxi/genesis_badge_metadata.json"
    );
    await tx.wait();
    alert("Badge minted successfully!");
    loadTopContributors();
  } catch (err) {
    console.error(err);
    alert("Mint failed");
  }
});

async function initContract() {
  const res = await fetch(abiPath);
  const abi = await res.json();
  contract = new ethers.Contract(contractAddress, abi, signer);
}

async function loadTopContributors() {
  if (!contract) return;
  const addresses = await contract.allContributors();
  const rows = await Promise.all(
    addresses.map(async (addr) => {
      const badges = await contract.getBadges(addr);
      if (badges.length === 0) return "";
      const meta = await contract.getBadgeMetadata(badges[0]);
      return `
        <tr>
          <td>${addr}</td>
          <td>${meta.title}</td>
          <td>${meta.year}</td>
          <td>${meta.businessName}</td>
          <td>${meta.location}</td>
        </tr>`;
    })
  );
  elements.contributors.innerHTML = rows.join("");
}

elements.themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

elements.languageSelect.addEventListener("change", (e) => {
  const lang = e.target.value;
  // Replace this with dynamic i18n logic
  alert("Language set to: " + lang);
});

document.addEventListener("DOMContentLoaded", () => {
  if (window.ethereum && window.ethereum.selectedAddress) {
    connectWallet();
  }
  loadTopContributors();
});
