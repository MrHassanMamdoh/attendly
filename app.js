import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-functions.js";

const firebaseConfig = {
  apiKey: "AIzaSyAM_Uw3aUXrdp3JNVJ_89qA6bqAToiV9gc",
  authDomain: "hadarnyapp.firebaseapp.com",
  projectId: "hadarnyapp",
  storageBucket: "hadarnyapp.firebasestorage.app",
  messagingSenderId: "228409785499",
  appId: "1:228409785499:web:8686f2668047caf60c5a3e"
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app); 
const getStudentData = httpsCallable(functions, "getStudentData");
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("attendlyForm");
  const groupSelect = document.getElementById("centerName");
  const examInput = document.getElementById("examNumber");
  const phoneInput = document.getElementById("phoneNumber");

  const resultBox = document.getElementById("resultBox");
  const studentNameEl = document.getElementById("studentName");
  const studentCodeEl = document.getElementById("studentCode");
  const accessCodeEl = document.getElementById("accessCode");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // ✅ نجيب القيم لحظة الضغط (مش برا الحدث)
    const groupId = groupSelect.value?.trim();
    const kashfNumber = examInput.value?.trim();
    const phone = phoneInput.value?.trim();

    console.log("Sending to function:", { groupId, kashfNumber, phone });

    // ✅ فحص القيم قبل الإرسال
    if (!groupId || !kashfNumber || !phone) {
      showResult(false, "اكمل كل الحقول");
      return;
    }

    try {

      // ✅ أهم نقطة: نبعت object مباشر (من غير data:)
      const result = await getStudentData({
        groupId,
        kashfNumber,
        phone
      });

      console.log("Function response:", result.data);

      if (result.data.success) {
        studentNameEl.textContent = result.data.name;
        studentCodeEl.textContent = result.data.code;
        accessCodeEl.textContent = result.data.password;
        resultBox.style.color = "green";
      } else {
        showResult(false, result.data.message);
      }

      resultBox.style.display = "block";

    } catch (err) {
      console.error("Function error:", err);
      showResult(false, "حدث خطأ أثناء الاتصال بالسيرفر");
    }

  });

  function showResult(success, message) {
    studentNameEl.textContent = "";
    studentCodeEl.textContent = "";
    accessCodeEl.textContent = message;
    resultBox.style.color = "red";
    resultBox.style.display = "block";
  }

});
