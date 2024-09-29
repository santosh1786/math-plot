import sys
import numpy as np
import matplotlib.pyplot as plt
import base64
from io import BytesIO
from sympy import symbols, sympify
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
    # Read function and variables from command line arguments
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

        if variables == 1:
            x_vals = np.linspace(-10, 10, 400)
            y_vals = [expr.evalf(subs={x: val}) for val in x_vals]

            plt.figure()
            plt.plot(x_vals, y_vals)
            plt.title("2D Plot")
            plt.xlabel("x")
            plt.ylabel("f(x)")
            plt.grid()

        elif variables == 2:
            y = symbols('y')
            x_vals = np.linspace(-10, 10, 50)
            y_vals = np.linspace(-10, 10, 50)
            X, Y = np.meshgrid(x_vals, y_vals)
            Z = [[expr.evalf(subs={x: x_val, y: y_val}) for y_val in y_vals] for x_val in x_vals]

            plt.figure()
            plt.plot_surface(X, Y, Z, cmap='viridis')

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
        logger.info(img_str)
        print(img_str)  # Print the Base64 string to stdout

    except Exception as e:
        logger.error(f"Error while processing function: {str(e)}", exc_info=True)
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
