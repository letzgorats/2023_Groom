// localStorage에서 할 일 목록을 불러오거나, 없으면 새 배열 생성
const itemsArray = localStorage.getItem("items") ? JSON.parse(localStorage.getItem("items")) : []

// 키보드 'Enter' 키로 새 할 일 추가 기능
document.querySelector("#item").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();  // 기본 동작 중단
        setTimeout(() => createItem(document.querySelector("#item")), 0);
    }
});

// console.log(itemsArray)

// 'Enter' 버튼 클릭으로 새 할 일 추가 기능
document.querySelector("#enter").addEventListener("click",() =>{
    const item = document.querySelector("#item")
    createItem(item)  // 항목 생성 함수 호출
})

// 할 일 목록을 화면에 표시하는 함수
function displayItems(){
    let items = "";
    itemsArray.forEach((item, i) => {
        // 완료된 항목에 대한 클래스 설정
        const completedClass = item.completed ? 'completed-item completed-item-style' : '';
        // 각 할 일 항목을 HTML로 구성
        items += `
            <div class="item ${completedClass}" data-index="${i}">
                <div class="input-controller">
                    <textarea disabled ${item.completed ? 'class="completed-item"' : ''}>${item.text}</textarea>
                    <div class="edit-controller">
                        <i class="fa-solid fa-trash deleteBtn"></i>
                        <i class="fa-solid fa-pen-to-square editBtn"></i>
                    </div>
                    <i class="fa-solid fa-check completeBtn ${item.completed ? 'completed' : ''}"></i>
                </div>
                <div class="update-controller">
                    <button class="saveBtn">Save</button>
                    <button class="cancelBtn">Cancel</button>
                </div>
            </div>`;
    });
    document.querySelector(".to-do-list").innerHTML = items; // 할 일 목록을 DOM에 추가 
    activateListeners(); // 이벤트 리스너 활성화
}

// 모든 이벤트 리스너를 활성화 하는 함수
function activateListeners() {
    activateDeleteListeners()
    activateEditListeners()
    activateSaveListeners()
    activateCancelListeners()    
    activateCompleteListeners()
}

// 완료 버튼 이벤트 리스너
function activateCompleteListeners() {
    document.querySelectorAll('.completeBtn').forEach((btn, i) => {
        btn.addEventListener('click', (e) => {
            const itemElement = btn.closest('.item'); // 할 일 항목 요소 찾기
            itemsArray[i].completed = !itemsArray[i].completed;
            if (itemsArray[i].completed) {
                itemElement.classList.add('completed-item-style');
            } else {
                itemElement.classList.remove('completed-item-style');
            }
            localStorage.setItem("items", JSON.stringify(itemsArray));
            displayItems(); // 목록 다시 표시
        });
    });
}

// 삭제 버튼 이벤트 리스너
function activateDeleteListeners(){
    let deleteBtn = document.querySelectorAll(".deleteBtn")
    deleteBtn.forEach((db,i) => {
        db.addEventListener("click",()=>{deleteItem(i)}) 
    }) // 삭제 함수 호출
}

// 편집 버튼 이벤트 리스너
function activateEditListeners(){
    let editBtns = document.querySelectorAll(".editBtn")
    const updateControllers = document.querySelectorAll(".update-controller")
    const inputs = document.querySelectorAll(".input-controller textarea")
    editBtns.forEach((eb,i)=>{
        eb.addEventListener("click",()=>{
            let textarea = inputs[i];
            textarea.dataset.originalValue = textarea.value; // 원래 값 저장
            updateControllers[i].style.display = "block";   // 편집 컨트롤러 표시
            textarea.disabled = false;  // 텍스트 영역 활성화
        })
    })
}

// 저장 버튼 이벤트 리스너
function activateSaveListeners(){
    const saveBtns =  document.querySelectorAll(".saveBtn")
    const inputs =  document.querySelectorAll(".input-controller textarea")
    saveBtns.forEach((sb,i)=>{
        sb.addEventListener("click",()=>{
            updateItem(inputs[i].value,i)
        }); // 업데이트 함수 호출
    })
}

// 취소 버튼 이벤트 리스너
function activateCancelListeners(){
    const cancelBtns =  document.querySelectorAll(".cancelBtn")
    const updateControllers =  document.querySelectorAll(".update-controller")
    const inputs = document.querySelectorAll(".input-controller textarea")
    cancelBtns.forEach((cb,i)=>{
        cb.addEventListener("click",()=>{
            const textarea = inputs[i];
            textarea.value = textarea.dataset.originalValue; // 원래 값으로 돌리기
            textarea.disabled = true;   // 텍스트 영역 비활성화
            updateControllers[i].style.display = "none";    // 편집 컨트롤러 숨김
        })
    })
}

// 항목 업데이트 함수
function updateItem(newText,i){
    itemsArray[i].text = newText;   // 텍스트 업데이트
    localStorage.setItem("items",JSON.stringify(itemsArray))    // 상태 저장
    location.reload()   // 페이지 리로드
}


// 항목 삭제 함수
function deleteItem(i){
    itemsArray.splice(i,1);     // 항목 삭제
    localStorage.setItem("items",JSON.stringify(itemsArray)); // 상태 저장
    location.reload();// 페이지 리로드
}


// 새 항목 생성 함수
function createItem(item){
    
    if (item.value.trim() !== "") {
        itemsArray.push({ text: item.value, completed: false }); // 새 항목 추가
        localStorage.setItem("items", JSON.stringify(itemsArray)); // 상태 저장
        displayItems();  // 목록 다시 표시 
        item.value = ""; // 입력 필드 초기화
    }
}
    
// 현재 날짜 표시 함수
function displayDate(){

    let date = new Date()
    date = date.toString().split(" ")
    console.log(date)

    document.querySelector("#date").innerHTML = date[1] + " " + date[2] + " " + date[3] 

}

// 페이지 로드 시 초기화 함수
window.onload = function(){
    displayDate()
    displayItems()
}