export function calculateTrendingScore(post){
    const age=(Date.now()-post.sharedAt)/1000*60*60;
    const comments=post.comments.length;
    const likes=post.likes.length;
    const views=post.views;

    return (views + comments*4+ likes*3)/(age+2);
}