// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyDB0dy7rIYku-Jfd8EpMCeqyN3w4Ia6LUI",
    authDomain: "qna1-3c767.firebaseapp.com",
    projectId: "qna1-3c767",
    storageBucket: "qna1-3c767.firebasestorage.app",
    messagingSenderId: "695937011734",
    appId: "1:695937011734:web:271bd8fbe06d7638276537",
    measurementId: "G-LS8531XYVJ"
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
const db = firebase.firestore();

// 페이지 로드 이벤트 추적
analytics.logEvent('page_view'); 