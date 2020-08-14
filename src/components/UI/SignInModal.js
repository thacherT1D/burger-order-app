import React from "react";
import { Form, Button, Modal } from "react-bootstrap";

const SignInModal = (props) => {
	return (
		<>
			<Modal show={props.show} onHide={props.onClose}>
				<Modal.Header closeButton>
					<Modal.Title>Login / Sign Up</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group controlId="formBasicEmail">
							<Form.Label>Email address</Form.Label>
							<Form.Control type="email" placeholder="Enter email" />
						</Form.Group>
						<Form.Group controlId="formBasicPassword">
							<Form.Label>Password</Form.Label>
							<Form.Control type="password" placeholder="Password" />
						</Form.Group>
						<Button variant="primary" type="submit">
							Login (Cancel)
						</Button>
					</Form>
				</Modal.Body>
				<Modal.Footer className="justify-content-center">
					<Button variant="outline-primary" onClick={props.onClose}>
						Sign Up (Cancel)
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default SignInModal;
