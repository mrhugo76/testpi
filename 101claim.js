import { auth, db, doc, getDoc, updateDoc, increment, serverTimestamp } from './firebase.js';

async function claimDailyEnergy() {
    const user = auth.currentUser;
    if (!user) {
        alert("请先登录！");
        return;
    }

    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userRef);
    
    if (!userSnapshot.exists()) {
        alert("用户数据不存在！");
        return;
    }

    const userData = userSnapshot.data();
    const lastClaim = userData.lastClaim ? userData.lastClaim.toDate() : null;
    const today = new Date();

    if (lastClaim && lastClaim.toDateString() === today.toDateString()) {
        alert("你今天已经领取过能量！");
        return;
    }

    await updateDoc(userRef, {
        totalEnergy: increment(100),
        dailyEnergy: 100,
        lastClaim: serverTimestamp()
    });

    alert("领取成功！获得 100 能量！");
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("claimEnergyBtn").addEventListener("click", claimDailyEnergy);
});
