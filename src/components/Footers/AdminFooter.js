import React from "react";
import {Container} from "react-bootstrap";

function AdminFooter() {
  return (
    <>
      <footer className="footer">
        <Container fluid className="pl-4 ml-2">
          <nav>
            <p className="copyright text-center">
              © {new Date().getFullYear()}
              . Developed by <a href="https://ivan4usa.com">Ivan Pol</a>
            </p>
          </nav>
        </Container>
      </footer>
    </>
  );
}

export default AdminFooter;
