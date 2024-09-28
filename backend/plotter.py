# backend/plotter.py
import sys
import numpy as np
import matplotlib.pyplot as plt
import base64
from io import BytesIO
from sympy import symbols, sympify

# Read function and variables from command line arguments
function_str = sys.argv[1].replace('X', 'x')  # Replace 'X' with 'x' for consistency
variables = int(sys.argv[2])

# Prepare the expression
x = symbols('x')
output_buffer = BytesIO()  # Create a BytesIO buffer to save the figure

if variables == 1:
    try:
        expr = sympify(function_str)
        x_vals = np.linspace(-10, 10, 400)
        y_vals = [expr.evalf(subs={x: val}) for val in x_vals]

        plt.figure()
        plt.plot(x_vals, y_vals)
        plt.title("2D Plot")
        plt.xlabel("x")
        plt.ylabel("f(x)")
        plt.grid()

        # Save the plot to the buffer
        plt.savefig(output_buffer, format='png')
        plt.close()

        # Convert to base64
        output_buffer.seek(0)
        img_str = base64.b64encode(output_buffer.getvalue()).decode('utf-8')
        print(img_str)  # Print the Base64 string to stdout

    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

elif variables == 2:
    y = symbols('y')
    try:
        expr = sympify(function_str)
        x_vals = np.linspace(-10, 10, 50)
        y_vals = np.linspace(-10, 10, 50)
        X, Y = np.meshgrid(x_vals, y_vals)
        Z = [[expr.evalf(subs={x: x_val, y: y_val}) for y_val in y_vals] for x_val in x_vals]

        plt.figure()
        plt.plot_surface(X, Y, Z, cmap='viridis')

        # Save the plot to the buffer
        plt.savefig(output_buffer, format='png')
        plt.close()

        # Convert to base64
        output_buffer.seek(0)
        img_str = base64.b64encode(output_buffer.getvalue()).decode('utf-8')
        print(img_str)  # Print the Base64 string to stdout

    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)  # Log any exceptions to stderr
        sys.exit(1)
