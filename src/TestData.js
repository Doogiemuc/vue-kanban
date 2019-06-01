//====================================
// Fixed Test Data

// Values for each editable field
var fieldValues = {
  "status": [
    { displayName: "New",         value: "New" },
    { displayName: "Ready",       value: "Ready" },
    { displayName: "In Progress", value: "InProgress" },
    { displayName: "Done",        value: "Done" },
  ],
  "releases": [
    { displayName: "Bluefish Release",  value: "bluefish"  },
    { displayName: "Carnivore Release", value: "carnivore" },
  ],
  "products": [
    { displayName: "MVP",       value: "mvp" },
    { displayName: "MobileApp", value: "mobileap" },
    { displayName: "eShop",     value: "eshop" },
  ],
  "labels": [
    { displayName: "Label 1", value: "label1" },
    { displayName: "Label 2", value: "label2" },
    { displayName: "Tag 3", value: "label3" },
    { displayName: "More 4", value: "label4" },
    { displayName: "Another 5", value: "label5" },
  ],
  "linkTypes": [
  	{	displayName: "related to",	value: "relatedTo" },
  	{	displayName: "depends on", value:	"dependsOn"	},
  	{	displayName: "child	of", value:	"childOf"	},
  	{	displayName: "in epic", value:	"inEpic" },
  ]
}


/** checks wether a string is empty or contains only whitespaces
var notEmptyValidator = function(str) {
  return str !== undefined && str.length > 0 && str.trim()
}
*/

/*
  Each card my have any number of fields.
  These are editable fields in the edit card modal popup
 */
var editableFields = [
	{
	  _id: "field/title",      // id of PouchDB doc
		displayName: "Title",    // label for input field
    key: "title",            // key of JS object attribute
		type:	"TextInput",       // type of field
		//validator: notEmptyValidator
	},
	{
		_id: "field/product",
		displayName: "Product",
    key: "product",
		type:	"SingleSelect",
		placeholder: "Select Product",
		options: fieldValues.products
	},
	{
	  _id: "field/release",
	  displayName: "Release",
    key: "release",
	  type: "SingleSelect",
	  options: fieldValues.releases
	},
	{
		_id: "field/labels",
		displayName: "Labels",
		type:	"MultiSelect",
    key: "labels",
		description: "You	can	select multiple	labels.",
		labels:	fieldValues.labels
	},
	{
		_id: "field/status",
		displayName: "Status",
    key: "status",
		type:	"ButtonGroup",
		buttons: fieldValues.status.map(st => { return { text: st.displayName, value: st.value } })  // list of statuus
	},
	{
		_id: "field/links",
		displayName: "Links",
    key: "links",
		type:	"CardLinks",
		linkTypes: fieldValues.linkTypes
	},
]

var kanbanData = [
  { // Columns on the kanban board. And statuus that are mapped to each column.
    _id: "columns",
    columns: [
      { displayName: "Todo", status: ["New", "Ready"] },
      { displayName: "In Progress", status: ["InProgress"] },
      { displayName: "Done", status: ["Done"] },
    ]
  },
  {
    _id: "getCardsForRowAndColFunc",
    getCardsForRowAndColFunc: "thisIsSomeJavaScriptFunktion() {... }"
  },
  {
    _id: "editableFields",
    editableFields: editableFields
  },
  {
    _id: "fieldValues",
    fieldValues: fieldValues
  }
]


//====================================
// PouchDB - in browser noSQL database
import PouchDB from 'pouchdb-browser'


var destroyDbs = function() {
  console.log("Removing all data from pouchDBs! ")
  let kanbanDb = new PouchDB('kanban_board');
  let cardsDb  = new PouchDB('kanban_cards');
  return Promise.all([
    cardsDb.destroy(),
    kanbanDb.destroy()
  ]).catch(function (err) {
    console.log("Cannot destroy DBs", err);
    return Promise.reject(err)
  })
}

var rankSeq = 1   // monotonously rising sequence.   Higher Ranks are higher up in the backlog
var createRandomCard = function(titlePrefix) {
  var randInt = getRandomInt(10000,99999)
  let card = {
    _id: "card/"+randInt,   // URLs as IDs.   nice I like!  https://github.com/jo/docuri
    title: titlePrefix+randInt,
    product: getRandomArrayElem(fieldValues.products).value,
    status:  getRandomArrayElem(fieldValues.status).value,
    release: getRandomArrayElem(fieldValues.releases).value,
    description: "Just a random card with some random description. ID of this card is "+randInt+" and it has a lot of more text.",
    labels: fieldValues.labels.sort(() => .5 - Math.random()).slice(0,getRandomInt(1,4)),     // [ "lab1", "lab2", "lab3"]
    rank:    rankSeq++,
    links: [],   // array of targetIds
  }
  return card
}

var createCards = function() {
  let cards = []
  // at least one card in every release and col
  for (let i = 0; i < fieldValues.status.length; i++) {
    for (let j = 0; j < fieldValues.releases.length; j++) {
      let card = createRandomCard("Card_")
      card.status  = fieldValues.status[i].value
      card.release = fieldValues.releases[j].value
      card.rank    = rankSeq++
      cards.push(card)
    }
  }
  // Some more random cards
  for (let i = 0; i < 10; i++) {
    let card = createRandomCard("Card_")
    cards.push(card)
  }
  //Add some links between cards
  for (let i = 0; i < 20; i++) {
    var sourceCard = cards[getRandomInt(0, cards.length)]
    var targetCard = cards[getRandomInt(0, cards.length)]
    if (sourceCard._id !== targetCard._id) {
      sourceCard.links.push({ linkType: "related", targetId: targetCard._id })
    }
  }
  return cards
}


var createTestData = function() {
  console.log("Adding test data")
  let kanbanDb = new PouchDB('kanban_board');
  let cardsDb  = new PouchDB('kanban_cards');
  let cards    = createCards()
  return Promise.all([
    kanbanDb.bulkDocs(kanbanData),
    cardsDb.bulkDocs(cards)
  ])
  .then(res => {
    console.log("DONE. Created Test data. Settings, fields and cards")
    return res
  })
  .catch(err => {
    console.log("Cannot createTestData!", err)
    return Promise.reject(err)
  })
}

function getRandomArrayElem(arr) {
  return arr[getRandomInt(0, arr.length)]
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export default {
  destroyDbs: destroyDbs,
  createTestData: createTestData,
  editableFields: editableFields
}
