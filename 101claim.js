import { auth, db, doc, getDoc, updateDoc, increment, serverTimestamp } from './firebase.js';

async function claimDailyEnergy() {
    const user = auth.currentUser;
    if (!user) return alert("请先登录！");

    const userRef = doc(db, "users", user.uid);
    const userData = (await getDoc(userRef)).data();

    const lastClaim = userData.lastClaim ? userData.lastClaim.toDate() : null;
    const today = new Date();

    if (lastClaim && lastClaim.getDate() === today.getDate()) {
        return alert("你今天已经领取过能量！");
    }

    await updateDoc(userRef, {
        totalEnergy: increment(100),
        dailyEnergy: 100,
        lastClaim: serverTimestamp()
    });

    alert("领取成功！获得 100 能量！");
}

document.getElementById("claimEnergyBtn").addEventListener("click", claimDailyEnergy);
