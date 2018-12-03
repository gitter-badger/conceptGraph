/* Given a query graph and a set of axioms, named "Schemata" in Sowa's
*  Ontology.
*/

/*
* Find common projection between 2 graphs;
* @param {graph} graph1 - the one you care about
* @param {graph} graph2 - the one you want to check out
* @returns {graph} u - common projection, if none, returns undefined
*/


function projection(graph1, graph2) {
  let v = graph1;
  let w = graph2;
  //console.log(`Comparing ${graph1.label} and ${graph2.label}`);
  let arr1 = graph1.concept;
  let arr2 = graph2.concept;
  var result = {name:graph2.label+'cP',concepts:[]}
  for(var i = 0; i<arr1.length;i++){
    //console.log(`1looking at ${arr1[i].label}`);
    for(var j = 0; j<arr2.length; j++) {
      //console.log(`2looking at ${arr2[j].label}`);
      if(arr1[i].label === arr2[j].label){
        result.concepts.push(arr2[j]);
      }
    }
  }
  if(result.concepts.length > 0) { //found something
    return result;
  } else { //nothing
    result = undefined;
    return result;
  }
}

/*
* Join two graphs on a common projection
* @param {graph} graph1 - to be joined to
* @param {graph} graph2 - to be joined from
* @param {object} join - common join information
* @transmutates graph 1 , so no return
*/

function join(graph1, graph2, join) {
  console.log(`joining`);
  console.log(graph1);
  console.log(graph2);
  //loop through the common join to identify the label of concept to be joined
  let i = 0;
  let l = join.concepts.length;
  for(i;i<l;i++){
    //find concept in each graph
    console.log('looking for:'+join.concepts[i].label);
    let concept1 = graph1.find('label',join.concepts[i].label)
    let concept2 = graph2.find('label',join.concepts[i].label)
    console.log('1');
    console.log(concept1);
    console.log('2');
    console.log(concept2);
    //find relation referencing uuid of concept in graph1

    //replace concept with concept from graph2 connect relation to said concept
    //making sure values stay in the new concept
    //loop again through
  }
  // get function from axiom/graph2 add to graph1 with label
}

/*
* Find question marks and propagate to solution, using axiom functions
* @param {graph} graph - graph to answer
* @returns {boolean} - true if no more question marks, false if unresolved
*/

function answer(graph) {
  //execute function in graph1 if label is concept of question mark
  return true;
}

/*
* Sort joins preferred by score, right now it's the more matching Concepts
* the more preferred it is for a join.
* @param {object} common1 - the one you care about
* @param {object} common2 - the one you want to check out
* @returns {number} - -1 to 1 depending on the length
*/

function preferred (common1, common2) {
  if(common1.concepts.length > common2.concepts.length) {
    return -1; //common1 needs to be ahead
  } else if (common1.concepts.length < common2.concepts.length) {
    return 1; //common2 needs to be ahead
  } else {
    return 0; //both the same, leave in order
  }
}

/*
* Algorithm C
* @constructor
* @param {graph} graph - the query graph
* @param {set of graphs} axioms - the domain axioms
* @return {graph} answer - answer graph for the query from the data
* Call method start.
*/

function algoC (graph, axioms) {
  this.q = graph;
  this.w = graph;
  this.axioms = axioms.axioms;
  this.listj = [];
  this.start = function() {
    var questions = [];
    var i = 0;
    var l = this.w.concept.length;
    for(i;i<l;i++){ //get concepts with question marks
      if(this.w.concept[i].value === "?") {
        questions.push(this.w.concept[i]);
      }
    }
    if(questions.length <= 0){ console.error('no questions defined');return; } // No questions asked
    //find common projections in the axioms store
    for(var i =0; i<this.axioms.length; i++) {
      let temp = projection(this.w,this.axioms[i]); //temp = set of common projections
      console.log('found:'+temp);
      if(temp != undefined) { //if not undefined
        temp.index = i;
        this.listj.push(temp)
      }
    }
    this.listj.sort(preferred) //sort by preferred axiom
    console.log('preferred');
    console.log(this.listj);
    //perform first join, then try to answer question mark.
    let v = this.listj.shift();
    console.log(v);
    console.log(v.index);
    join(this.w,this.axioms[v.index],v);
    let ans = answer(this.w); //if we can answer, true
    if(ans){console.log(this.w);return;}
    this.start()
  };
}
