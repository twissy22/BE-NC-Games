const db = require("../connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
	if (!created_at) return { ...otherProperties };
	return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
	return arr.reduce((ref, element) => {
		ref[element[key]] = element[value];
		return ref;
	}, {});
};

exports.formatComments = (comments, idLookup) => {
	return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
		const article_id = idLookup[belongs_to];
		return {
			article_id,
			author: created_by,
			...this.convertTimestampToDate(restOfComment),
		};
	});
};
exports.checkreviewID = (id)=>{
	if(isNaN(id)){return Promise.reject({ status: 400, msg: "incorrect data type for id" });}
return db
.query(
	'SELECT * FROM reviews WHERE review_id = $1;',[id]
)
.then((result)=>{
	if(result.rows.length ===0){
		return Promise.reject({status: 404, msg: "no review matching that id"})
	   }
})
}
exports.checkUser = (user)=>{
	return db
	.query(
		'SELECT * FROM users WHERE username = $1;',[user]
	)
	.then((result)=>{
		if(result.rows.length ===0){
			return Promise.reject({status: 404, msg: "no user matching that username"})
		   }
	})	
}