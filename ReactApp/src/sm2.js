// Here is the original algorithm, which we modified a bit to be more applicable for our task

function sm2(answer_history, a = 6.0, b = -0.8, c = 0.28, d = 0.02, theta = 0.2) {

    if (answer_history[-1] < 3) return 1

    let correct_streak = 0;
    for (let i = answer_history.length - 1; i >= 0; i--) {
        if (answer_history[i] < 3) break
        correct_streak++
    }

    return a * Math.pow(Math.max(1.3, 2.5 + answer_history.reduce((prev, val) => prev + (b + (c * val) + (d * val * val)), 0)), theta * correct_streak);

}


// performanceRating: a float from [0.0, 1.0] indicating the student's performance in their recollection, normalized
// daysBetweenReviews: days until it is supposed to be shown again
// dateLastReviews: last time the user saw the card
// difficulty: current difficuly of the item based on student's answer history
// inspired by: https://www.blueraja.com/blog/477/a-better-spaced-repetition-learning-algorithm-sm2

function sm2Modified(performanceRating, daysBetweenReviews, dateLastReviewed, difficulty) {
    let percentOverdue = 1.0
    if (performanceRating >= 0.6) {
        percentOverdue = Math.min(2.0, (new Date() - dateLastReviewed) / 1000 / 60 / 60 / 24 / daysBetweenReviews)
        difficulty += percentOverdue * (1.0/17.0) * (8.0 - 9.0 * performanceRating)
        if (difficulty < 0.0) difficulty = 0.0
        if (difficulty > 1.0) difficulty = 1.0
        let difficultyWeight = 3 - 1.7 * difficulty
        daysBetweenReviews *= 1.0 + (difficultyWeight - 1.0) * percentOverdue * (Math.random() / 10.0 + 0.95)
        percentOverdue = Math.min(2.0, (new Date() - dateLastReviewed) / 1000 / 60 / 60 / 24 / daysBetweenReviews)
    } else {
        difficulty += percentOverdue * (1.0/17.0) * (8.0 - 9.0 * performanceRating)
        if (difficulty < 0.0) difficulty = 0.0
        if (difficulty > 1.0) difficulty = 1.0
        daysBetweenReviews *= 1.0 / (1.0 + 3.0 * difficulty)
    }

    return { percentOverdue: percentOverdue, daysBtwnReviews: daysBetweenReviews, dateLastReviewed: new Date(), diff: difficulty }

}

//console.log(sm2(x=[2, 1, 3, 3, 4, 1, 2, 3, 4]))
console.log(sm2Modified(0.5 , 3.676, new Date('December 1, 2021 03:24:00'), 0.4))
