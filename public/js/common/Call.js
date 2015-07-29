// simple for now
var Call = function (name, phone, time) {
	this.id = Math.random().toString(36).substring(7);
    this.name = name;
    this.phone = phone;
    this.time = time;
};
