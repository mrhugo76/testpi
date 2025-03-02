import { auth, db, doc, setDoc, getDocs, query, where, createUserWithEmailAndPassword, serverTimestamp, updateDoc, arrayUnion } from './firebase.js';

async function registerUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const referralCode = document.getElementById("referralCode").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userReferralCode = 'REF' + Math.random().toString(36).substring(2, 8).toUpperCase();
        const userRef = doc(db, "users", user.uid);

        await setDoc(userRef, {
            email,
            totalEnergy: 0,
            dailyEnergy: 0,
            referralCode: userReferralCode,
            referredBy: referralCode || null,
            referredUsers: [],
            rewardLevels: { level1: 5, level2: 3, level3: 2, level4: 1 },
            lastClaim: null,
            createdAt: serverTimestamp(),
            balance: 0,
            miningHistory: []
        });

        if (referralCode) {
            const refQuery = query(collection(db, "users"), where("referralCode", "==", referralCode));
            const refSnapshot = await getDocs(refQuery);
            if (!refSnapshot.empty) {
                const referrerDoc = refSnapshot.docs[0];
                await updateDoc(doc(db, "users", referrerDoc.id), { referredUsers: arrayUnion(user.uid) });
            }
        }

        alert("注册成功！");
    } catch (error) {
        alert("注册失败：" + error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("registerBtn").addEventListener("click", registerUser);
});
