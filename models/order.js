 import moment from 'moment';

class Order {
	constructor(id, items, totalAmount, date) {
		this.id = id;
		this.items = items;
		this.totalAmount = totalAmount;
		this.date = date;
	}

	get readableDate() {
		// Problem with android
		// return this.date.toLocaleDateString('en-En', {
		// 	year: 'numeric',
		// 	month: 'long',
		// 	day: 'numeric',
		// 	hour: '2-digit',
		// 	minute: '2-digit'
		// });
		return moment(this.date).format('DD/MM/YYYY, hh:mm')
	}
}

export default Order;
