import React, { useState, useEffect, useReducer } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";

import axios from "../axios-orders";
import Burger from "components/Burger/Burger";
import ControlPanel from "components/Burger/ControlPanel";
import { useOrderStore, useOrderDispatch } from 'context/orderContext';


const BurgerBuilder = (props) => {
	const { ingredients, error, basePrice, prices } = useOrderStore();
	const dispatch = useOrderDispatch();

	const history = useHistory(); // TODO: use this

	const [show, setShow] = useState(false);

	useEffect(() => {
		const getData = async () => {
			try {
				const [priceResponse, ingredientsResponse] = await Promise.all([
					axios.get(
						"https://burger-generator-cdbeb.firebaseio.com/%22basePrice%22.json"
					),
					axios.get(
						"https://burger-generator-cdbeb.firebaseio.com/%22bigIngredients%22.json"
					),
				]);

				const prices = ingredientsResponse.data.reduce((acc, ingredient) => {
					acc[ingredient.name] = ingredient.cost;
					return acc;
				}, {});
				console.log(prices);
				const ingredients = ingredientsResponse.data.reduce(
					(acc, ingredient) => {
						acc[ingredient.name] = ingredient.defaultValue;
						return acc;
					},
					{}
				);
				console.log(ingredients);
				const properIngredients =
					// (props.location.state && props.location.state.ingredients) ||
					ingredients;

				dispatch({
					type: "INIT",
					payload: {
						basePrice: priceResponse.data,
						ingredients: properIngredients,
						prices: prices,
					},
				});
			} catch (error) {
				dispatch({ type: "ERROR" });
			}
		};

		getData();
	}, []);

	const addIngredientHandler = (type) => {
		const oldCount = ingredients[type];
		const updatedCount = oldCount + 1;
		const updatedIngredients = {
			...ingredients,
		};
		updatedIngredients[type] = updatedCount;
		dispatch({ type: "MODIFY_INGREDIENTS", payload: updatedIngredients });
	};

	const removeIngredientHandler = (type) => {
		const oldCount = ingredients[type];
		if (oldCount <= 0) {
			return;
		}
		const updatedCount = oldCount - 1;
		const updatedIngredients = {
			...ingredients,
		};
		updatedIngredients[type] = updatedCount;
		dispatch({ type: "MODIFY_INGREDIENTS", payload: updatedIngredients });
	};

	const purchaseHandler = () => {
		setShow(true);
		dispatch({ type: "TOGGLE_PURCHASE", payload: true });

	};

	const purchaseCancelHandler = () => {
		setShow(false);
		dispatch({ type: "TOGGLE_PURCHASE", payload: false });
	};

	const purchaseContinueHandler = (totalPrice) => {
		const queryParams = [];

		for (let i in ingredients) {
			queryParams.push(
				encodeURIComponent(i) + "=" + encodeURIComponent(ingredients[i])
			);
		}
		queryParams.push("price=" + totalPrice);
		const queryString = queryParams.join("&");

		props.history.push({
			pathname: "/checkout",
			search: "?" + queryString,
			state: {
				ingredients: ingredients,
			},
		});
	};

	const purchasable = Object.values(ingredients).reduce(
		(sum, el) => sum + el,
		0
	);

	const totalPrice =
		basePrice +
		Object.entries(ingredients)
			.map(([key, value]) => {
				return prices[key] * +value;
			})
			.reduce((sum, el) => sum + el, 0);

	return (
		<>
			<Helmet>
				<title>Build a Burger | Good Burger</title>
			</Helmet>
			<Container fluid>
				<Row>
					<Col md={10} sm={10} className="justify-content-center">
						<h1>Burger Builder</h1>
					</Col>
				</Row>
				<Row className="justify-content-center">
					<Burger ingredients={ingredients} />
				</Row>
				<Row className="justify-content-center">
					{error ? (
						<p>Ingredients can't be loaded</p>
					) : (
						<ControlPanel
							ingredientAdded={addIngredientHandler}
							ingredientRemoved={removeIngredientHandler}
							ingredients={ingredients}
							disabled={purchasable}
							purchasable={purchasable}
							ordered={purchaseHandler}
							// ordered={purchaseContinueHandler}
							price={totalPrice}
							show={show}
							onClose={purchaseCancelHandler}

						/>
					)}
				</Row>

				{/* TODO: populate order data to checkout page -- use Context*/}
				{/* TODO: get form submission with order information to push to firebase */}
				{/* TODO: Setup SCHEDULE MY ORDER modal (Mockup of Tidepool component) */}
				{/* TODO: add uuid library for order number and customer number (for when auth is added) */}
				{/* TODO: Setup more testing */}
				{/* TODO: Setup Auth -- customer user sign up/sign in */}
				{/* TODO: How to use images for individual burger pieces so that different ingredients can be more easily added/removed */}
			</Container>
		</>
	);
};

export default BurgerBuilder;
