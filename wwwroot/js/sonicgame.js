let config = {
    type: Phaser.AUTO,
    width: 600,
    height: 720,
    physics: {
        default: 'arcade'
    },
    scene: {
        init: init,
        preload: preload,
        create: create,
        update: update
    },
    autoCenter: true
};

// Déclaration de nos variables globales
let game = new Phaser.Game(config);
let currentIndex = 0;
let labelAnswer = [];
let labelAnswerText = [];
let ring = [];
let score = 0;
let ringCount = 0;
let sonicRuns;
let winRingSound, finishQuizSound;
let sonicRunTween;

function init() {
    score = 0;
    state = 'start';
}
function preload() {
    this.load.image('background', './assets/Sprites/greenhillzone.jpg');
    this.load.image('start', './assets/Sprites/sonic-forces.png');
    this.load.image('label', './assets/Sprites/Label.png');
    this.load.image('label1', './assets/Sprites/Label1.png');
    this.load.image('label4', './assets/Sprites/Label4.png');
    this.load.image('monitor', './assets/Sprites/playmonitor.png');
    this.load.image('platform', './assets/Sprites/greenPlatform.png');
    this.load.image('ring', './assets/Sprites/ringretro.png');
    this.load.image('sparkles','./assets/Sprites/sparkles-icon.png');
    this.load.json('question', './assets/data/Questions.json');
    this.load.spritesheet('sonicRuns','./assets/Sprites/sonicsprites.png', {frameWidth:150, frameHeight: 169});
    this.load.audio('ringSound', './assets/Sound/sonic/ring.mp3');
    this.load.audio('finishGameSound', './assets/Sound/sonic/course_finish.mp3');
    this.load.audio('noRing', './assets/Sound/sonic/wrong.wav');
    
    loadFont("digital7", "./assets/Fonts/digital-7_italic.ttf");
    loadFont("helNeue", "./assets/Fonts/HelNeue.otf");
    loadFont("hellNeue", "./assets/Fonts/HellNeue.otf");

}

function create() {
    questionJSON = this.cache.json.get('question');
    //console.log(questionJSON.questions[0].goodAnswer);
    questionJSON = this.cache.json.get('question');
    //console.log(questionJSON.questions[2].answer[0]);

    backgroundImage = this.add.image(-145, 0,'background');
    backgroundImage.setOrigin(0,0);
    backgroundImage.setScale(1);
    
    
    // labelFinalScore = this.add.image(300,300, 'label');
    // labelFinalScore.setScale(0.8);
    // labelFinalScoreText = this.add.text(300, 290, "Score         ", { fontFamily: 'digital7', fontSize: 25, color: '#000000' });
    // labelFinalScoreText.setOrigin(0.5, 0.5);
    // //labelFinalScore.alpha = 0;
    
    labelQuestion = this.add.image(300,155,'label1');
    labelQuestion.setScale(0.6);
    // labelQuestionText = this.add.text(300,140,questionJSON.questions[0].title, {fontFamily : 'helNeue', 
    // fontSize: 20, 
    // color: '#000000',
    // align: 'center'});
    // labelQuestionText.setOrigin(0.5, 0.5);
    
    labelQuestionText = this.add.text(300,140,questionJSON.questions[0].title, {fontFamily : 'helNeue', 
    fontSize: 20, 
    color: '#ffffff',
    align: 'center'});
    labelQuestionText.setOrigin(0.5, 0.5);
    
    for (let i=0; i<3; i++){
        labelAnswer[i] = this.add.image(300,240+80*i,'label4').setInteractive();
        labelAnswer[i].on('pointerdown', () => {checkAnswer(i)}); // [() =>] =vite fait pour dire que c'est une function sans nom
    }
    
    for (let i=0;i<3;i++){
        labelAnswerText[i] = this.add.text(300,235+80*i,questionJSON.questions[currentIndex].answer[i], {fontFamily : 'hellNeue', 
        fontSize: 18, 
        color: '#fffffff',
        align: 'center'});
        labelAnswerText[i].setOrigin(0.5,0.5);
        // this.add.text est un constructor
    }
    
    for (let i=0;i<10;i++){
        ring[i] = this.add.image(50+55*i,500,'ring');
        ring[i].setScale(0.08);
        ring[i].alpha = 0;
    }
    
    scoreTextB = this.add.text(10, 10, "Score         ", { fontFamily: 'digital7', fontSize: 25, color: '#000000' })
    scoreText = this.add.text(10, 10, "Score         ", { fontFamily: 'digital7', fontSize: 24, color: '#fffb00' })
    scoreValue = this.add.text(120, 10, score, {fontFamily: 'digital7', fontSize: 25, color: '#000000'})
    scoreValueB =this.add.text(120, 10, score, { fontFamily: 'digital7', fontSize: 24, color: '#FFFFFF' });
    
    ringCountTextB = this.add.text(10, 40, "Rings       ", { fontFamily: 'digital7', fontSize: 25, color: '#000000' })
    ringCountText = this.add.text(10, 40, "Rings       ", { fontFamily: 'digital7', fontSize: 24, color: '#fffb00' })
    ringCountValueB = this.add.text(110, 40, ringCount, {fontFamily: 'digital7', fontSize: 25, color: '#000000'})  
    ringCountValue = this.add.text(110, 40, ringCount, {fontFamily: 'digital7', fontSize: 24, color: '#ff0000'})  
    
    playButton = this.add.image(300,620,'monitor').setInteractive();
    playButton.setScale(0.15);
    playButton.on('pointerdown', nextQuestion);
    
    platformButton = this.add.image(300,850,'platform');
    platformButton.setOrigin(0.5,0.5);
    platformButton.setScale(1.7);
    
    //crée l'animation sans la jouer et la cache quand elle est terminée
    sonicRuns = this.anims.create({
        key:'run',
        frames: this.anims.generateFrameNumbers('sonicRuns'),
        frameRate:15,
        repeat:-1,
        hideOnComplete:true
    });
    sonicRuns = this.add.sprite((config.width - 680), 465);
    sonicRuns.play('run');
    sonicRunTween = this.tweens.add({ //////////////////////IL FAUT CREER UNE VAR POUR STOCKER LE TWEEN 88
        targets: sonicRuns,
        x: 700,
        ease: 'Linear',
        yoyo: false,
        duration: 4000,
        repeat: 0,
        paused:true
    });
    
    winRingSound = this.sound.add('ringSound');
    finishQuizSound = this.sound.add('finishGameSound');
    wrongAnswer = this.sound.add('noRing');

    startImage = this.add.image(300,350, 'start').setInteractive();
    //startImage.setScale(0.5);
    startImage.on('pointerdown', startGame);
    startTextB = this.add.text(300,600, "Start the quizz? \n Let's go !", {fontFamily : 'digital7', 
    fontSize: 40, 
    color: '#000000',
    align: 'center'});
    startTextB.setOrigin(0.5, 0.5);600
    startText = this.add.text(300, 600,"Start the quizz? \n Let's go !", {fontFamily : 'digital7', 
    fontSize: 40, 
    color: '#FF9700',
    align: 'center'});
    startText.setOrigin(0.5, 0.5);

}
function update() {
   
    // détecte la collision entre l'ennemi et le joueur
    for (let i = 0; i <10; i++){
        if (Phaser.Geom.Intersects.RectangleToRectangle(
            ring[i].getBounds(),
            sonicRuns.getBounds())){
                
                if(ring[i].alpha == 1){
                                        ring[i].setPosition(-100,-100);
                    ringCount++;
                    if(i==0) finishQuizSound.play();

                }
            }
        }
        ringCountValueB.text = ringCount;
        ringCountValue.text = ringCount;
        if (ringCount >=1)
        {
            ringCountValue.setColor('#ffffff');
            
        }
    }
    
    function checkAnswer(answerNumber){
        for(let i=0;i<3;i++){
            labelAnswerText[i].setColor('#7D7D7D');
            
        }
        labelAnswerText[questionJSON.questions[currentIndex].goodAnswer].setColor('#000AC8');
        
        if(answerNumber == questionJSON.questions[currentIndex].goodAnswer) {
            ring[currentIndex].alpha = 1;
            score+=100;
            scoreText.text = "Score         " ;
            scoreTextB.text = "Score         " ;
            scoreValue.text = score;
            scoreValueB.text = score;


            winRingSound.play();

    }
    else {
        ring[currentIndex].alpha = 0.3;
        wrongAnswer.play();

    }
    playButton.setVisible(true);

    for(let i=0;i<3;i++){
        labelAnswer[i].disableInteractive();

    }
}

function nextQuestion() {
    currentIndex++;
    if(currentIndex < 10){
        labelQuestionText.text = questionJSON.questions[currentIndex].title;
        // type objet ts les deux,
        for (let i=0;i<3;i++){
            labelAnswerText[i].text = questionJSON.questions[currentIndex].answer[i];
                                  // this.add.text est un constructor
            labelAnswerText[i].setColor('#000000');
            labelAnswer[i].setInteractive();
        }
    }
    else{ /////////////////////////////////////////////////////////////////// tween pour faire apparaitre score
        labelQuestionText.setVisible(false);
        labelQuestion.setVisible(false); //////////////////////////////////// CHANGER LABEL QUESTION
        for (let i=0;i<3;i++){
            labelAnswerText[i].text = "";
            labelAnswer[i].setVisible(false);
        }
        sonicRunTween.play();
    }
    playButton.setVisible(false);
}

function startGame() {
    startImage.setVisible(false);
    startText.setVisible(false);
    startTextB.setVisible(false);
    //tweenInElements();
    for (let i = 0; i < 10; i++) {
        starImage[i].setVelocity(0,0);
        starImage[i].setPosition(30 + i * 60, 600, );
        starImage[i].setVisible(true);
        starImage[i].alpha = 0.3;
        starImage[i].tint = 0xffffff;
    }
}

function loadFont(name, url) {
    var newFont = new FontFace(name, `url(${url})`);
    newFont.load().then(function (loaded) {
        document.fonts.add(loaded);
    }).catch(function (error) {
        return error;
    });
}