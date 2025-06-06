// 질문 데이터를 저장할 배열
let questions = [];

// 질문 제출 함수
function submitQuestion() {
    const titleInput = document.getElementById('questionTitle');
    const contentInput = document.getElementById('questionContent');
    const detailInput = document.getElementById('questionDetail');
    
    if (!titleInput || !contentInput || !detailInput) {
        console.error('필요한 DOM 요소를 찾을 수 없습니다.');
        return;
    }
    
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const detail = detailInput.value.trim();
    
    if (!title || !content || !detail) {
        alert('모든 필드를 입력해주세요.');
        return;
    }
    
    const question = {
        id: Date.now(),
        title: title,
        content: content,
        detail: detail,
        answers: [],
        date: new Date().toLocaleString(),
        views: 0
    };
    
    questions.unshift(question);
    saveQuestions();
    displayQuestions();
    
    // 입력 필드 초기화
    titleInput.value = '';
    contentInput.value = '';
    detailInput.value = '';
}

// 답변 제출 함수
function submitAnswer(questionId) {
    const answerInput = document.getElementById(`answer-${questionId}`);
    
    if (!answerInput) {
        console.error('답변 입력 필드를 찾을 수 없습니다.');
        return;
    }
    
    const answer = answerInput.value.trim();
    
    if (!answer) {
        alert('답변 내용을 입력해주세요.');
        return;
    }
    
    const question = questions.find(q => q.id === questionId);
    if (question) {
        question.answers.push({
            content: answer,
            date: new Date().toLocaleString()
        });
        saveQuestions();
        displayQuestions();
        answerInput.value = '';
    }
}

// 질문 목록 표시 함수
function displayQuestions() {
    const container = document.getElementById('questionsContainer');
    if (!container) {
        console.error('질문 컨테이너를 찾을 수 없습니다.');
        return;
    }
    
    container.innerHTML = '';
    
    questions.forEach(question => {
        const questionElement = document.createElement('div');
        questionElement.className = 'question-card';
        questionElement.innerHTML = `
            <div class="question-title">${escapeHtml(question.title)}</div>
            <div class="question-meta">
                <span>작성일: ${escapeHtml(question.date)}</span>
                <span>조회수: ${question.views}</span>
                <span>답변: ${question.answers.length}개</span>
            </div>
            <div class="question-content">${escapeHtml(question.content)}</div>
            <div class="question-detail">${escapeHtml(question.detail)}</div>
            
            <div class="answers-list">
                ${question.answers.map(answer => `
                    <div class="answer">
                        <div class="answer-content">${escapeHtml(answer.content)}</div>
                        <div class="answer-meta">작성일: ${escapeHtml(answer.date)}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="answer-form">
                <textarea id="answer-${question.id}" class="answer-input" placeholder="답변을 입력하세요"></textarea>
                <button onclick="submitAnswer(${question.id})" class="answer-btn">답변 등록</button>
            </div>
        `;
        container.appendChild(questionElement);
        
        // 조회수 증가
        question.views++;
    });
    
    saveQuestions();
}

// HTML 이스케이프 함수
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// 질문 검색 함수
function filterQuestions() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();
    
    const filteredQuestions = questions.filter(question => 
        question.title.toLowerCase().includes(searchTerm) ||
        question.content.toLowerCase().includes(searchTerm) ||
        question.detail.toLowerCase().includes(searchTerm)
    );
    
    displayFilteredQuestions(filteredQuestions);
}

// 정렬 함수
function sortQuestions() {
    const sortSelect = document.getElementById('sortSelect');
    const sortBy = sortSelect.value;
    
    let sortedQuestions = [...questions];
    
    switch(sortBy) {
        case 'newest':
            sortedQuestions.sort((a, b) => b.id - a.id);
            break;
        case 'oldest':
            sortedQuestions.sort((a, b) => a.id - b.id);
            break;
        case 'mostAnswers':
            sortedQuestions.sort((a, b) => b.answers.length - a.answers.length);
            break;
    }
    
    displayFilteredQuestions(sortedQuestions);
}

// 필터링된 질문 표시 함수
function displayFilteredQuestions(filteredQuestions) {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';
    
    filteredQuestions.forEach(question => {
        const questionElement = document.createElement('div');
        questionElement.className = 'question-card';
        questionElement.innerHTML = `
            <div class="question-title">${escapeHtml(question.title)}</div>
            <div class="question-meta">
                <span>작성일: ${escapeHtml(question.date)}</span>
                <span>조회수: ${question.views}</span>
                <span>답변: ${question.answers.length}개</span>
            </div>
            <div class="question-content">${escapeHtml(question.content)}</div>
            <div class="question-detail">${escapeHtml(question.detail)}</div>
            
            <div class="answers-list">
                ${question.answers.map(answer => `
                    <div class="answer">
                        <div class="answer-content">${escapeHtml(answer.content)}</div>
                        <div class="answer-meta">작성일: ${escapeHtml(answer.date)}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="answer-form">
                <textarea id="answer-${question.id}" class="answer-input" placeholder="답변을 입력하세요"></textarea>
                <button onclick="submitAnswer(${question.id})" class="answer-btn">답변 등록</button>
            </div>
        `;
        container.appendChild(questionElement);
    });
}

// 로컬 스토리지에 질문 저장
function saveQuestions() {
    try {
        localStorage.setItem('questions', JSON.stringify(questions));
    } catch (error) {
        console.error('질문 저장 중 오류 발생:', error);
        alert('질문 저장 중 오류가 발생했습니다.');
    }
}

// 로컬 스토리지에서 질문 불러오기
function loadQuestions() {
    try {
        const savedQuestions = localStorage.getItem('questions');
        if (savedQuestions) {
            questions = JSON.parse(savedQuestions);
            displayQuestions();
        }
    } catch (error) {
        console.error('질문 불러오기 중 오류 발생:', error);
        alert('질문 불러오기 중 오류가 발생했습니다.');
    }
}

// 페이지 로드 시 저장된 질문 불러오기
document.addEventListener('DOMContentLoaded', loadQuestions);
