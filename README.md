# Entelect Challenge 2025

This repository contains my solution for the Entelect Challenge 2025.

## Project Structure

```text
entelect-challenge-2025/
├── entelect_challenge/      # Main package
│   ├── __init__.py          # Package init
│   └── main.py              # Main entry point
├── tests/                   # Test directory
│   ├── __init__.py          # Test package init
│   └── test_challenge.py    # Test cases
├── .flake8                  # Flake8 configuration
├── .gitignore               # Git ignore file
├── pyproject.toml           # Poetry configuration
└── README.md                # This file
```

## Setup

This project uses Poetry for dependency management.

### Prerequisites

- Python 3.10+
- Poetry

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/entelect-challenge-2025.git
cd entelect-challenge-2025
```

1. Install dependencies with Poetry:

```bash
poetry install
```

### Development

- Activate the virtual environment:

```bash
poetry shell
```

- Run the solution:

```bash
poetry run challenge
```

- Run tests:

```bash
poetry run pytest
```

- Format code:

```bash
poetry run black .
```

- Lint code:

```bash
poetry run flake8
```

## Dependencies

### Main Dependencies

- numpy: Scientific computing
- pandas: Data analysis and manipulation
- networkx: Network analysis
- matplotlib: Data visualization
- requests: HTTP requests

### Development Dependencies

- black: Code formatting
- flake8: Linting
- pytest: Testing
- pytest-cov: Test coverage
- mypy: Type checking

## License

This project is licensed under the MIT License - see the LICENSE file for details.
