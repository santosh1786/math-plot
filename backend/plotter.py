import sys
import numpy as np
import matplotlib.pyplot as plt
import base64
from io import BytesIO
from sympy import symbols, sympify, lambdify
import logging
from logging.handlers import RotatingFileHandler

# Set up logging with rotation
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

# Create a rotating file handler
handler = RotatingFileHandler(
    "plotter.log", maxBytes=5*1024*1024, backupCount=5  # 5 MB limit, keep 5 backup files
)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

def main():
    """Main function to process plotting requests."""
    if len(sys.argv) < 3:
        logger.error("Insufficient arguments provided. Usage: python plotter.py <function> <variables>")
        sys.exit(1)

    function_str = sys.argv[1].replace('X', 'x')  # Replace 'X' with 'x' for consistency
    try:
        variables = int(sys.argv[2])
    except ValueError:
        logger.error("Invalid number of variables provided. Must be an integer.")
        sys.exit(1)

    # Prepare the expression
    x = symbols('x')
    output_buffer = BytesIO()  # Create a BytesIO buffer to save the figure

    try:
        logger.info(f"Processing function: {function_str} with {variables} variable(s)")
        expr = sympify(function_str)

        # Lambda function for evaluation
        f_lambdified = lambdify(x, expr, modules='numpy')

        if variables == 1:
            x_vals = np.linspace(-10, 10, 400)
            y_vals = f_lambdified(x_vals)

            plt.figure()
            plt.plot(x_vals, y_vals)
            plt.title(f"Plot of f(x) = {function_str}")
            plt.xlabel("x")
            plt.ylabel("f(x)")
            plt.grid()

        elif variables == 2:
            y = symbols('y')
            expr_2d = sympify(function_str)  # Allow for multi-variable expressions
            f_lambdified_2d = lambdify((x, y), expr_2d, modules='numpy')
            x_vals = np.linspace(-10, 10, 50)
            y_vals = np.linspace(-10, 10, 50)
            X, Y = np.meshgrid(x_vals, y_vals)
            Z = f_lambdified_2d(X, Y)

            plt.figure()
            ax = plt.axes(projection='3d')
            ax.plot_surface(X, Y, Z, cmap='viridis')
            ax.set_title(f"Plot of f(x, y) = {function_str}")

        else:
            logger.error(f"Unsupported number of variables: {variables}. Must be 1 or 2.")
            sys.exit(1)

        # Save the plot to the buffer
        plt.savefig(output_buffer, format='png')
        plt.close()

        # Convert to base64
        output_buffer.seek(0)
        img_str = base64.b64encode(output_buffer.getvalue()).decode('utf-8')
        logger.info("Successfully generated plot.")
        print(img_str)  # Print the Base64 string to stdout

    except Exception as e:
        logger.error(f"Error while processing function: {str(e)}", exc_info=True)
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
