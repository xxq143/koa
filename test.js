let str = 'str'
Class People{
	constroctor(name, age) {
	this.name = name;
	this.age = age
	}
	say:function() {
		console.log(`hi ${this.name}你好`)
	}
}
let tom = new People('tom', 18)
tom.say();
