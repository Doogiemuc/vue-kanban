//====================================
// Fixed Test Data
// Columns on the kanban board. And statuus that are mapped to each column.
const settings = [
  {
    _id: "settings/columns",
    columns: [
      { displayName: "Todo", status: ["New", "Ready"] },
      { displayName: "In Progress", status: ["InProgress"] },
      { displayName: "Done", status: ["Done"] },
    ]
  },
  {
    _id: "settings/getCardsForRowAndColFunc",
    func: "thisIsSomeJavaScriptFunktion() {... }"
  },
]

// Values for each editable field
const fieldValues = {
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
	  _id: "field/title",
		displayName: "Title",
		type:	"TextInput",
		//validator: notEmptyValidator
	},
	{
		_id: "field/product",
		displayName: "Product",
		type:	"SingleSelect",
		placeholder: "Select Product",
		options: fieldValues.products
	},
	{
	  _id: "field/release",
	  displayName: "Release",
	  type: "SingleSelect",
	  options: fieldValues.releases
	},
	{
		_id: "field/labels",
		displayName: "labels",
		type:	"MultiSelect",
		description: "You	can	select multiple	labels.",
		tags:	fieldValues.labels
	},
	{
		_id: "field/status",
		displayName: "Status",
		type:	"ButtonGroup",
		buttons: fieldValues.status  // list of statuus
	},
	{
		_id: "field/links",
		displayName: "Links",
		type:	"CardLinks",
		linkTypes: fieldValues.linkTypes
	},
]

//====================================
// PouchDB - in browser noSQL database
import PouchDB from 'pouchdb-browser'


var destroyDbs = function() {
  console.log("Removing all data from pouchDBs! ")
  var kanbanDb = new PouchDB('kanban_board');
  var cardsDb  = new PouchDB('kanban_cards');
  return Promise.all([
    cardsDb.destroy(),
    kanbanDb.destroy()
  ]).catch(function (err) {
    console.log("Cannot destroy DBs", err);
    return Promise.reject(err)
  })
}

var createRandomCard = function(titlePrefix) {
  var randInt = getRandomInt(10000,99999)
  var card = {
    _id: "card/"+randInt,   // URLs as IDs.   nice I like!  https://github.com/jo/docuri
    title: titlePrefix+randInt,
    product: getRandomArrayElem(fieldValues.products),
    status:  getRandomArrayElem(fieldValues.status),
    release: getRandomArrayElem(fieldValues.releases),
    description: "Just a random card with some random description. ID of this card is "+randInt+" and it has a lot of more text.",
    labels: fieldValues.labels.sort(() => .5 - Math.random()).slice(0,3),
    links: [],
  }
  return card
}

var createCards = function(cardsDb) {
  var cards = []
  // at least one card in every release and col
  for (let i = 0; i < fieldValues.status.length; i++) {
    for (let j = 0; j < fieldValues.releases.length; j++) {
      let card = createRandomCard("Card_")
      card.status  = fieldValues.status[i]
      card.release = fieldValues.releases[j]
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
      sourceCard.links.push({ linkType: "related", target: targetCard._id })
    }
  }
  // bulk insert cards into DBs.
  return cardsDb.bulkDocs(cards)
    .then(() => {
      console.log("DONE. Added "+cards.length+" new cards.")
      return cards
    })
    .catch(err => {
      console.error("ERROR. Could not createTestData", err)
      return Promise.reject(err)
    })
}


var createTestData = function() {
  console.log("Adding test data")
  var kanbanDb = new PouchDB('kanban_board');
  var cardsDb  = new PouchDB('kanban_cards');
  return Promise.all([
    kanbanDb.bulkDocs(settings),
    kanbanDb.bulkDocs(editableFields),
    createCards(cardsDb)
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
