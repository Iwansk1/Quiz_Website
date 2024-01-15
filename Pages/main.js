var $ = jQuery.noConflict();

$(document).ready(function(e){
    SiteManager.init();
});

var SiteManager = {
    oCurrentQuestionData: null,
    oQuestionsData: null,
    

    init: function () {
        $.getJSON('JEOPARDY_QUESTIONS1.json', this.onJsonLoaded.bind(this));
        $('.js-input').on('keydown', this.onInputKeyDown.bind(this));
        $('.js-input-check').on('click', this.onInputCheckClicked.bind(this));
    },
    onJsonLoaded: function (data) {
        shuffleArray(data);
        this.oQuestionsData = data;
        this.generateCategoryButtons(data);
        this.startNewRound();
    },

    onInputKeyDown: function (e) {
        // Check if the pressed key is "Enter" (key code 13)
        if (e.keyCode === 13) {
            this.onInputCheckClicked();
        }
    },

    onInputCheckClicked: function () {

        var isItCorrect = this.checkAnswer($('.js-input').val(), this.oCurrentQuestionData.answer);
        if (isItCorrect) {
            alert("Correct!");
            this.showNextQuestion();
        } else {
            alert("Incorrect. Please try again.");
        }
    },

    checkAnswer: function (_answerGiven, _correctAnswer) {
        // Convert both inputs to lowercase for case-insensitive comparison
        _answerGiven = _answerGiven.toLowerCase();
        _correctAnswer = _correctAnswer.toLowerCase();
        // Check if the user's input is correct
        return _answerGiven === _correctAnswer;
        
    },


    showNextQuestion: function () {
        $('.js-input').val('');
    
        if (this.oQuestionsData && this.oQuestionsData.length > 0) {
            for (var i = 1; i < 4; i++) {
                this.oCurrentQuestionData = this.oQuestionsData.pop();
                if (this.oCurrentQuestionData) {
                    // Correct the jQuery selector here
                    $('.js-questions' + i).html(`<div class='question'>${this.oCurrentQuestionData.question}</div>`);
                    console.log("Category: " + this.oCurrentQuestionData.category);
                    console.log("Correct answer = " + this.oCurrentQuestionData.answer);
                } else {
                    console.error("No more questions available.");
                    // Handle the case when there are no more questions
                    // For example, you might want to display a message or end the game.
                }
            }
        }
    },


    generateCategoryButtons: function(data){
        var categoriesContainer = $('.js-categories');
        var categories = Array.from(new Set(data.map(question => question.category)));

        var categoriesToShow = categories.slice(0, 3);
        categoriesToShow.forEach(category => {
            var button = $('<button>').text(category).addClass('category-button');
            button.on('click', () => this.filterQuestionsByCategory(category));
            categoriesContainer.append(button);
            
        });
    },
    
        
    filterQuestionsByCategory: function (category) {
        // Filter questions based on the selected category and display a new round
        var filteredQuestions = this.oQuestionsData.filter(question => question.category === category);
        shuffleArray(filteredQuestions);
        this.oQuestionsData = filteredQuestions;
        this.startNewRound();
    },
    startNewRound: function () {
        
            this.showNextQuestion();
        }
    };

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
