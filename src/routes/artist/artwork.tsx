import { Icons } from "@/components/icons";
import { useDebouncedValue } from "@/utils/use-debounced-value";
import { useSuspenseQueryDeferred } from "@/utils/use-suspense-query-deferred";
import { getArtistArtworks$ } from "@server/artist";
import { getArtistArtworkQueryOptions } from "@server/query-options";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { useEffect, useState } from "react";
import {
	Badge,
	Button,
	buttonStyles,
	Card,
	Description,
	Heading,
	SearchField,
	Table,
} from "ui";
import { z } from "zod";

const artworkSearchParam = z.object({
	page: fallback(z.number().min(1), 1).default(1),
	limit: fallback(z.number().min(1).max(100), 10).default(10),
	search: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute(
	"/_dashboard-layout-id/dashboard/artworks",
)({
	validateSearch: zodValidator(artworkSearchParam),
	loaderDeps: ({ search: { page, limit, search } }) => ({
		page,
		limit,
		search,
	}),
	loader: async ({
		context: { queryClient },
		deps: { page, limit, search },
	}) => {
		queryClient.ensureQueryData(
			getArtistArtworkQueryOptions({ page, limit, search }),
		);
	},
	component: RouteComponent,
});



const getBadgeConditionIntent = (condition: string) => {
	switch (condition.toLowerCase()) {
		case "new":
			return "success";
		case "like new":
			return "info";
		case "good":
			return "primary";
		case "fair":
			return "warning";
		case "poor":
			return "danger";
		default:
			return "secondary";
	}
};

function RouteComponent() {
	const { limit, page, search } = Route.useSearch();
	const [searchTerm, setSearchTerm] = useState(search);
	const [debounced] = useDebouncedValue(searchTerm, 300);
	const navigate = Route.useNavigate();
	const getArtistArtworks = useServerFn(getArtistArtworks$);

	const { data: artworks, isSuspending } = useSuspenseQueryDeferred({
		...getArtistArtworkQueryOptions({ page, limit, search }),
		queryFn: async () => {
			const res = await getArtistArtworks({ data: { page, limit, search } });

			return res;
		},
	});

	const isFirstPage = page === 1;
	const isLastPage =
		page === artworks.pagination.totalPages ||
		artworks.pagination.totalPages === 0;

	// Sync the debounced search term with the URL search param
	useEffect(() => {
		navigate({
			search: (prev) => ({
				...prev,
				search: debounced.trim(),
				page: 1, // Reset to first page when search changes
			}),
		});
	}, [debounced, navigate]);

	return (
		<div>
			<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
				<div>
					<Heading>Artworks</Heading>
					<Description>
						Manage and track all your artworks in one place
					</Description>
				</div>
				<Link className={buttonStyles({ shape: "circle", size: "small" })}>
					<Icons.ArtworkUpload />
					Upload Artwork
				</Link>
			</div>
			<div className="mt-8">
				<div className="flex justify-end">
					<SearchField
						aria-label="Search Artworks"
						className={"w-full"}
						value={searchTerm}
						onChange={(value) => setSearchTerm(value)}
						isPending={isSuspending}
						placeholder="Search artworks..."
					/>
				</div>
				<div className="mt-4">
					<Card>
						<Table aria-label="Artworks">
							<Table.Header>
								<Table.Column>Artwork ID</Table.Column>
								<Table.Column isRowHeader>Artwork Name</Table.Column>
								<Table.Column>Price</Table.Column>
								<Table.Column>Category</Table.Column>
								<Table.Column>Dimensions</Table.Column>
								<Table.Column>Weight</Table.Column>
								<Table.Column>Stock</Table.Column>
								<Table.Column>Condition</Table.Column>
								<Table.Column>Actions</Table.Column>
							</Table.Header>
							<Table.Body
								items={artworks.artworks}
								renderEmptyState={() => (
									<div className="flex flex-col items-center justify-center p-4">
										<p className="text-fg text-base mb-1 font-semibold">
											No artworks found
										</p>
										<p className="text-muted-fg text-sm">
											You haven't uploaded any artworks yet. Start by adding
											your first artwork.
										</p>
										<Link
											className={buttonStyles({
												size: "extra-small",
												className: "mt-4",
												shape: "circle",
											})}
										>
											<Icons.ArtworkUpload />
											Upload Artwork
										</Link>
									</div>
								)}
							>
								{(items) => (
									<Table.Row id={items.id}>
										<Table.Cell>{items.id}</Table.Cell>
										<Table.Cell>{items.title}</Table.Cell>
										<Table.Cell>{items.price}</Table.Cell>
										<Table.Cell>{items.category}</Table.Cell>
										<Table.Cell>{items.dimensions}</Table.Cell>
										<Table.Cell>{items.weight}</Table.Cell>
										<Table.Cell>{items.stock}</Table.Cell>
										<Table.Cell>
											<Badge intent={getBadgeConditionIntent(items.condition)}>
												{items.condition}
											</Badge>
										</Table.Cell>
										<Table.Cell>
											<Link>View</Link>
										</Table.Cell>
									</Table.Row>
								)}
							</Table.Body>
						</Table>
					</Card>
					{artworks.pagination.totalPages > 1 && (
						<div className="flex items-center justify-between gap-2 mt-4">
							<Button
								appearance="outline"
								size="small"
								onPress={() => navigate({ search: { page: page - 1 } })}
								isDisabled={isFirstPage}
							>
								Previous
							</Button>
							<p className="text-sm text-muted-fg text-center">
								Page {artworks.pagination.currentPage} of{" "}
								{artworks.pagination.totalPages}
							</p>
							<Button
								appearance="outline"
								size="small"
								onPress={() => navigate({ search: { page: page + 1 } })}
								isDisabled={isLastPage}
							>
								Next
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
