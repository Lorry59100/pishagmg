import { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/components/orderhistoric.css"
import { Link } from 'react-router-dom';
import { useTokenService } from "../../services/TokenService";
import { formatDate } from "../../services/DateServices";
import { convertToEuros } from "../../services/PriceServices";

function OrderHistoric() {
    const { decodedUserToken } = useTokenService();
    const [orders, setOrders] = useState(null);
    const URL = import.meta.env.VITE_BACKEND;
    const URL_MAIN_IMG = import.meta.env.VITE_MAIN_IMG;
    const URL_USER_ORDER = import.meta.env.VITE_USER_ORDER;
    const URL_SINGLE_ORDER_HISTORIC = import.meta.env.VITE_SINGLE_ORDER_HISTORIC;

    useEffect(() => {
        if (decodedUserToken) {
            const headers = {
            'Authorization': `Bearer ${decodedUserToken.username}`,
        };

        axios.get(`${URL}${URL_USER_ORDER}`, {headers})
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des adresses :', error);
            });
        }
    }, [decodedUserToken, URL, URL_USER_ORDER]);

    return (
    <div className="order-historic-container">
            <h2>Mes achats</h2>
            {orders !== null && orders.map((order) => (
                <div key={order.id} className="order-layout-container">
                    <Link to={`${URL_SINGLE_ORDER_HISTORIC}/${order.reference}`}>
                        <div className="order-container">
                            {order.status === true ? (
                                <span className="order-status order-done">Terminée</span>
                            ) : order.status === false ? (
                                <span className="order-status order-incoming">En cours de livraison</span>
                            ) : (
                                <p>Le statut n'est ni égal à 1 ni égal à 0</p>
                            )}
                            <div>
                                {order.order_details.map((detail, detailIndex) => (
                                    <div key={detail.id}>
                                        <div className="order-detail-container">
                                            <div className="order-detail-img-info">
                                                <img src={`${URL}${URL_MAIN_IMG}/${detail.img}`} alt={detail.product} />
                                                <div className="order-detail-info">
                                                    <h2>{detail.product} {detail.quantity > 1 && `x${detail.quantity}`}</h2>
                                                    <h4>{detail.platform}</h4>
                                                </div>
                                            </div>
                                            <div className="order-detail-price">
                                                <h4>{convertToEuros(detail.price)} €</h4>
                                            </div>
                                        </div>
                                            {detailIndex < order.order_details.length - 1 && (
                                                <div className="cutline-form"></div>
                                            )}
                                    </div>
                                ))}
                            </div>
                            <div className="cutline-form"></div>
                            <div className="order-total-price">
                                <h2>Total</h2>
                                <h2>{convertToEuros(order.total)}€</h2>
                            </div>
                        </div>
                    </Link>
                    <div className="sub-order-container">
                        <p>Commande {order.reference} • {formatDate(order.created_at.date)}</p>
                            {order.status === true ? (
                                <p>Délivrée le: {formatDate(order.delivery_date.date)}</p>
                            ) : order.status === false ? (
                                <p>Livraison prévue le: {formatDate(order.delivery_date.date)}</p>
                            ) : (
                                <p>Le statut n'est ni égal à 1 ni égal à 0</p>
                            )}
                    </div>
                </div>
            ))}
        </div>
  )
}

export default OrderHistoric