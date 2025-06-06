let questions = [];

// 질문 제출 함수
async function submitQuestion() {
    const title = document.getElementById('questionTitle').value.trim();
    const content = document.getElementById('questionContent').value.trim();
    const detail = document.getElementById('questionDetail').value.trim();

    if (!title || !content || !detail) {
        alert('모든 필드를 입력해주세요.');
        return;
    }

    try {
        const question = {
            title: title,
            content: content,
            detail: detail,
            answers: [],
            date: new Date().toISOString()
        };

        // Firestore에 질문 추가
        await db.collection('questions').add(question);
        
        // 이벤트 추적
        analytics.logEvent('question_submitted');

        // 입력 필드 초기화
        document.getElementById('questionTitle').value = '';
        document.getElementById('questionContent').value = '';
        document.getElementById('questionDetail').value = '';

        // 질문 목록 새로고침
        loadQuestions();
    } catch (error) {
        console.error('질문 저장 중 오류 발생:', error);
        analytics.logEvent('error', { error_type: 'question_submission_error' });
        alert('질문 저장 중 오류가 발생했습니다.');
    }
}

// 답변 제출 함수
async function submitAnswer(questionId) {
    const answerInput = document.getElementById(`answer-${questionId}`);
    const answer = answerInput.value.trim();

    if (!answer) {
        alert('답변 내용을 입력해주세요.');
        return;
    }

    try {
        const answerData = {
            content: answer,
            date: new Date().toISOString()
        };

        // Firestore에 답변 추가
        const questionRef = db.collection('questions').doc(questionId);
        const questionDoc = await questionRef.get();
        
        if (!questionDoc.exists) {
            throw new Error('질문을 찾을 수 없습니다.');
        }

        const currentAnswers = questionDoc.data().answers || [];
        await questionRef.update({
            answers: [...currentAnswers, answerData]
        });

        // 이벤트 추적
        analytics.logEvent('answer_submitted');

        answerInput.value = '';
        loadQuestions();
    } catch (error) {
        console.error('답변 저장 중 오류 발생:', error);
        analytics.logEvent('error', { error_type: 'answer_submission_error' });
        alert('답변 저장 중 오류가 발생했습니다.');
    }
}

// 질문 목록 표시 함수
function displayQuestions(questionsData) {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';

    questionsData.forEach(doc => {
        const question = doc.data();
        const questionId = doc.id;
        
        const questionElement = document.createElement('div');
        questionElement.className = 'question-card';
        questionElement.innerHTML = `
            <h3>${question.title}</h3>
            <p><small>작성일: ${new Date(question.date).toLocaleString()}</small></p>
            <div class="content">${question.content}</div>
            <div class="detail">${question.detail}</div>
            
            <div class="answers">
                ${question.answers.map(answer => `
                    <div class="answer">
                        <div>${answer.content}</div>
                        <small>작성일: ${new Date(answer.date).toLocaleString()}</small>
                    </div>
                `).join('')}
            </div>
            
            <div class="answer-form">
                <textarea id="answer-${questionId}" placeholder="답변을 입력하세요"></textarea>
                <button onclick="submitAnswer('${questionId}')">답변 등록</button>
            </div>
        `;
        container.appendChild(questionElement);
    });
}

// 질문 불러오기 함수
async function loadQuestions() {
    try {
        const snapshot = await db.collection('questions')
            .orderBy('date', 'desc')
            .get();
        
        const questionsData = snapshot.docs;
        displayQuestions(questionsData);

        // 이벤트 추적
        analytics.logEvent('questions_loaded', { count: questionsData.length });
    } catch (error) {
        console.error('질문 불러오기 중 오류 발생:', error);
        analytics.logEvent('error', { error_type: 'questions_load_error' });
        alert('질문 불러오기 중 오류가 발생했습니다.');
    }
}

// 페이지 로드 시 질문 불러오기
document.addEventListener('DOMContentLoaded', loadQuestions); 