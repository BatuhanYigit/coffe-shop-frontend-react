import React, { Component } from "react";

export const DataContext = React.createContext();

export class DataProvider extends Component {



    state = {
        products: [],
        cart: []

    };


    getproducts_test() {
        const data = fetch("http://localhost:8000/item")


    }

    set_products = (data) => {
        console.log("context ", data)

        this.setState({ products: data })

    }


    payment() {
        const dataCart = JSON.parse(localStorage.getItem('dataCart'))
        fetch("http://localhost:8000/payment", {
            method: 'POST',
            body: JSON.stringify(dataCart[0]),
            headers: {
                "Content-Type": 'application/json',
                "Accept": 'application/json'
            }
        })
        console.log("deneme =======", dataCart[0])
    }

    addCart = (id) => {
        console.log("test", id)
        const { products, cart } = this.state;
        const check = cart.every(item => {
            return item.id !== id;
        })
        if (check) {
            const data = products.filter(product => {
                return product.id === id
            })
            this.setState({ cart: [...cart, ...data] })
        } else {
            alert("The product has been added to cart.")
        }
        const data = products.filter(product => {
            return product.id === id
        })
        this.setState({ cart: [...cart, ...data] })
        this.getTotal();
        console.log('dataCart', JSON.stringify(this.state.cart))
    };

    reduction = id => {
        const { cart } = this.state;
        cart.forEach(item => {
            if (item.id === id) {
                item.count === 1 ? item.count = 1 : item.count -= 1;
            }
        })
        this.setState({ cart: cart });
        this.getTotal();
    };
    increase = id => {
        const { cart } = this.state;
        cart.forEach(item => {
            if (item.id === id) {
                item.count += 1;
            }
        })
        this.setState({ cart: cart });
        this.getTotal();
        console.log(this.getproducts_test())
    };

    removeProduct = id => {
        if (window.confirm("Ürünü Silmek İstiyor musunuz?")) {
            const { cart } = this.state;
            cart.forEach((item, index) => {
                if (item.id === id) {
                    cart.splice(index, 1)
                }
            })
            this.setState({ cart: cart });
            this.getTotal();

        }

    }

    getTotal = () => {
        const { cart } = this.state;
        const res = cart.reduce((prev, item) => {
            return prev + (item.item_price * item.count);
        }, 0)
        this.setState({ total: res })
    };

    componentDidUpdate() {
        localStorage.setItem('dataCart', JSON.stringify(this.state.cart))
        localStorage.setItem('dataTotal', JSON.stringify(this.state.total))
    }

    componentDidMount() {


        const dataCart = JSON.parse(localStorage.getItem('dataCart'))
        if (dataCart !== null) {
            this.setState({ cart: dataCart });
        }
        // const dataTotal = JSON.parse(localStorage.getItem('dataTotal'))
        // if (dataTotal !== null) {
        //     this.setState({ total: dataTotal });
        // }

    }

    render() {
        const { products, cart, total } = this.state;
        const { addCart, reduction, increase, removeProduct, getTotal, payment, set_products } = this;
        return (
            <DataContext.Provider value={{ products, addCart, cart, reduction, increase, removeProduct, total, getTotal, payment, set_products }}>
                {this.props.children}
            </DataContext.Provider>
        )
    }
}