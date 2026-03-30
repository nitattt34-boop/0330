let pathPoints = [];
let gameState = 'START_WAIT'; // 狀態：START_WAIT, PLAYING, WIN, LOSE

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();
  initPath();
}

// 產生適應螢幕大小的賽道路徑
function initPath() {
  let w = width;
  let h = height;
  pathPoints = [
    {x: w*0.1, y: h*0.3}, {x: w*0.2, y: h*0.6}, {x: w*0.3, y: h*0.4},
    {x: w*0.5, y: h*0.8}, {x: w*0.7, y: h*0.3}, {x: w*0.9, y: h*0.7}
  ];
}

function draw() {
  // 1. 繪製背景 (深灰色牆壁)
  background(34); 

  // 2. 繪製粗賽道
  noFill();
  stroke(85); // 賽道顏色
  strokeWeight(80); 
  strokeJoin(ROUND);
  beginShape();
  for (let p of pathPoints) vertex(p.x, p.y);
  endShape();
  
  // 3. 繪製中心細白線
  stroke(255);
  strokeWeight(2);
  beginShape();
  for (let p of pathPoints) vertex(p.x, p.y);
  endShape();
  
  // 4. 繪製起點 (綠色) 與終點 (紅色)
  let startP = pathPoints[0];
  let endP = pathPoints[pathPoints.length - 1];
  
  fill(0, 255, 0); noStroke(); circle(startP.x, startP.y, 40); 
  fill(255, 0, 0); noStroke(); circle(endP.x, endP.y, 40);

  // ==========================================
  // 【關鍵修正】：必須在畫出玩家游標和文字「之前」，先讀取畫面顏色！
  // ==========================================
  let hitColor = [0, 0, 0];
  if (gameState === 'PLAYING') {
    hitColor = get(mouseX, mouseY);
  }

  // 5. 繪製文字標示 (讀取完顏色後再畫，避免干擾)
  fill(0); textSize(12); textAlign(CENTER, CENTER); text("START", startP.x, startP.y);
  fill(255); text("GOAL", endP.x, endP.y);

  // 6. 處理遊戲狀態邏輯與畫出玩家
  if (gameState === 'START_WAIT') {
    fill(255); textSize(32); text("點擊綠色起點開始遊戲", width / 2, 50);
    fill(255); circle(mouseX, mouseY, 15); // 畫出玩家
  } 
  else if (gameState === 'PLAYING') {
    fill(255); textSize(32); text("遊玩中：請沿著賽道移動...", width / 2, 50);
    fill(255); circle(mouseX, mouseY, 15); // 畫出玩家
    
    // 碰撞偵測 (使用範圍容錯，避免抗鋸齒導致偵測失敗)
    // 如果讀到的顏色很暗 (RGB都小於50)，代表碰到深灰背景了
    if (hitColor[0] < 50 && hitColor[1] < 50 && hitColor[2] < 50) {
      gameState = 'LOSE';
    }
    // 如果讀到的顏色很紅 (R>200, G<50, B<50)，代表碰到終點了
    else if (hitColor[0] > 200 && hitColor[1] < 50 && hitColor[2] < 50) {
      gameState = 'WIN';
    }
  } 
  else if (gameState === 'LOSE') {
    // 失敗畫面覆蓋
    background(255, 0, 0, 200);
    fill(255); textSize(64); text("失敗！點擊畫面重新開始", width / 2, height / 2);
    cursor(); 
  } 
  else if (gameState === 'WIN') {
    // 過關畫面覆蓋
    background(0, 255, 0, 200);
    fill(255); textSize(64); text("過關！點擊畫面重新開始", width / 2, height / 2);
    cursor();
  }
}

// 點擊事件處理
function mousePressed() {
  if (gameState === 'START_WAIT') {
    // 檢查點擊位置是否在起點附近
    let startP = pathPoints[0];
    if (dist(mouseX, mouseY, startP.x, startP.y) < 30) {
      gameState = 'PLAYING';
      noCursor();
    }
  } 
  else if (gameState === 'LOSE' || gameState === 'WIN') {
    // 點擊任意處重新開始
    gameState = 'START_WAIT';
    noCursor();
  }
}

// 視窗縮放時重新計算賽道比例
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initPath();
}